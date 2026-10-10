import type {
  ExamConfig,
  ExamItem,
  ExamSession,
  GradedExam,
  GradedItem,
  HistoryEntry,
  Question,
  WeekBreakdown,
} from '../types'

export type Rng = () => number

/** Small seedable RNG so tests can be deterministic. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates. Returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** True for the main answer and for any option listed in `alsoCorrect`. */
export function isCorrectChoice(q: Pick<Question, 'answer' | 'alsoCorrect'>, chosen: number): boolean {
  return chosen === q.answer || (q.alsoCorrect?.includes(chosen) ?? false)
}

/** Short fingerprint (FNV-1a) of everything that defines a question, including its correct answer. */
export function questionSig(q: Question): string {
  const text = [q.q, q.code ?? '', q.answer, (q.alsoCorrect ?? []).join(','), ...q.options].join('\u0001')
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

/** Identifies "the same question" across weeks (same wording and same code). */
export function stemKey(q: Question): string {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return `${norm(q.q)}|${(q.code ?? '').replace(/\s+/g, '')}`
}

/** Options that refer to each other ("None of the above") must keep their order. */
export function hasFixedOptions(q: Question): boolean {
  if (q.fixedOptions) return true
  return q.options.some((o) => /\b(none|all|both|neither)\s+of\s+(the\s+)?(above|these)\b/i.test(o))
}

/** All questions an exam with this config could draw from (duplicates across weeks removed). */
export function buildPool(config: Pick<ExamConfig, 'mode' | 'weeks'>, bank: readonly Question[]): Question[] {
  const weeks = config.mode === 'random' ? null : new Set(config.weeks)
  const seen = new Set<string>()
  const pool: Question[] = []
  for (const q of bank) {
    if (weeks && !weeks.has(q.week)) continue
    const key = stemKey(q)
    if (seen.has(key)) continue
    seen.add(key)
    pool.push(q)
  }
  return pool
}

/** Builds a fresh exam, or null when the config selects no questions. */
export function createSession(
  config: ExamConfig,
  bank: readonly Question[],
  rng: Rng = Math.random,
  now: number = Date.now(),
): ExamSession | null {
  const pool = buildPool(config, bank)
  if (pool.length === 0) return null

  const count = Math.min(Math.max(1, Math.floor(config.count)), pool.length)
  const position = new Map(pool.map((q, i) => [q.id, i]))

  // Choose which questions, then restore bank order (sessionFromQuestions re-shuffles if asked to).
  const picked = (count < pool.length ? shuffle(pool, rng).slice(0, count) : [...pool]).sort(
    (a, b) => position.get(a.id)! - position.get(b.id)!,
  )

  return sessionFromQuestions(picked, config, rng, now)
}

/**
 * Builds an exam from an exact list of questions. Questions are kept in the order given unless
 * `config.shuffleQuestions` is set. Also used for "retry my mistakes".
 */
export function sessionFromQuestions(
  picked: readonly Question[],
  config: ExamConfig,
  rng: Rng = Math.random,
  now: number = Date.now(),
): ExamSession {
  const ordered = config.shuffleQuestions ? shuffle(picked, rng) : [...picked]
  const items: ExamItem[] = ordered.map((q) => ({
    id: q.id,
    sig: questionSig(q),
    order:
      config.shuffleOptions && !hasFixedOptions(q) ? shuffle(range(q.options.length), rng) : range(q.options.length),
  }))

  return {
    id: `${now.toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`,
    config: { ...config, count: items.length },
    items,
    answers: {},
    marked: [],
    current: 0,
    startedAt: now,
    endsAt: config.timerMinutes ? now + config.timerMinutes * 60_000 : null,
    submittedAt: null,
  }
}

export type QuestionState = 'current' | 'answered' | 'marked' | 'marked-answered' | 'unanswered'

export function stateOf(session: ExamSession, index: number): QuestionState {
  const id = session.items[index].id
  const answered = id in session.answers
  const marked = session.marked.includes(id)
  if (index === session.current) return 'current'
  if (marked) return answered ? 'marked-answered' : 'marked'
  return answered ? 'answered' : 'unanswered'
}

export function countAnswered(session: ExamSession): number {
  return session.items.filter((it) => it.id in session.answers).length
}

/** Scores a session. Items whose question no longer exists in the bank are ignored. */
export function gradeSession(
  session: ExamSession,
  lookup: ReadonlyMap<string, Question>,
  now: number = Date.now(),
): GradedExam {
  const items: GradedItem[] = []
  for (const it of session.items) {
    const question = lookup.get(it.id)
    if (!question) continue
    const chosen = it.id in session.answers ? session.answers[it.id] : null
    items.push({
      question,
      order: it.order,
      chosen,
      status: chosen === null ? 'skipped' : isCorrectChoice(question, chosen) ? 'correct' : 'wrong',
      marked: session.marked.includes(it.id),
    })
  }

  const correct = items.filter((i) => i.status === 'correct').length
  const wrong = items.filter((i) => i.status === 'wrong').length
  const skipped = items.length - correct - wrong

  const weeks = new Map<number, WeekBreakdown>()
  for (const i of items) {
    const row = weeks.get(i.question.week) ?? { week: i.question.week, total: 0, correct: 0 }
    row.total++
    if (i.status === 'correct') row.correct++
    weeks.set(i.question.week, row)
  }

  const end = session.submittedAt ?? now
  return {
    items,
    total: items.length,
    correct,
    wrong,
    skipped,
    percent: items.length ? Math.round((correct / items.length) * 100) : 0,
    durationSec: Math.max(0, Math.round((end - session.startedAt) / 1000)),
    byWeek: [...weeks.values()].sort((a, b) => a.week - b.week),
  }
}

export function toHistoryEntry(session: ExamSession, graded: GradedExam): HistoryEntry {
  return {
    id: session.id,
    at: session.submittedAt ?? Date.now(),
    mode: session.config.mode,
    weeks: graded.byWeek.map((w) => w.week),
    total: graded.total,
    correct: graded.correct,
    wrong: graded.wrong,
    skipped: graded.skipped,
    durationSec: graded.durationSec,
    byWeek: graded.byWeek,
  }
}

/** Default time limit: one minute per question, never below 5 minutes. */
export function suggestMinutes(questionCount: number): number {
  return Math.max(5, questionCount)
}
