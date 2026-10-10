import { RECIPIENT } from '../config'
import type { GradedExam, HistoryEntry } from '../types'
import { mulberry32, type Rng } from './exam'

const N = RECIPIENT

/** FNV-1a, so a text (e.g. an exam id) can seed the random generator. Same text, same messages. */
export function hashSeed(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export const seededRng = (text: string): Rng => mulberry32(hashSeed(text))

const pick = <T>(items: readonly T[], rng: Rng): T => items[Math.floor(rng() * items.length)]

// ------------------------------------------------------------------------------------------ welcome

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night'

/** 5-11 morning, 12-16 afternoon, 17-20 evening, 21-4 night. */
export function dayPart(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

const GREETING: Record<DayPart, string> = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Hello',
}

const WELCOME_LINES: Record<DayPart, readonly string[]> = {
  morning: [
    'Wishing you a pleasant and productive morning. Your practice room is ready whenever you are.',
    'A quiet morning is a good time for practice. Please take it at your own pace.',
    `It is a pleasure to have you here, ${N}. Please begin whenever you wish.`,
    'There is no hurry at all. Whenever you are ready, your questions are waiting.',
  ],
  afternoon: [
    `Hope your day is going well, ${N}. Your practice is ready whenever you are.`,
    'A short break and a few questions is all it needs to be.',
    'Please choose a week and begin whenever it is convenient.',
    'There is no rush this afternoon. Please take one question at a time.',
  ],
  evening: [
    `Hope you had a good day, ${N}. A little practice now will make tomorrow lighter.`,
    'The day\u2019s work is behind you. This is only practice, so there is no pressure.',
    `Please settle in, ${N}. Your questions are ready when you are.`,
    'A calm evening session can do a lot. Please begin whenever you like.',
  ],
  night: [
    `Working late, ${N}? Even a few questions will help. Please do rest well.`,
    'It is late, so a short round may be enough. Wishing you a restful night ahead.',
    'Quiet hours are good for focus. Please take your time.',
    'Rest matters as much as revision. A little practice, then a good night\u2019s sleep.',
  ],
}

export interface WelcomeContext {
  /** Number of finished practice tests so far. */
  attempts: number
  last?: { correct: number; total: number }
}

export interface Welcome {
  eyebrow: string
  title: string
  line: string
}

export function welcome(date: Date, ctx: WelcomeContext, rng: Rng = Math.random): Welcome {
  const part = dayPart(date.getHours())
  const lines: string[] = [...WELCOME_LINES[part]]
  if (ctx.last) {
    lines.push(`Last time you scored ${ctx.last.correct} out of ${ctx.last.total}. Wishing you an even better result today.`)
  }
  if (ctx.attempts >= 3) {
    lines.push(`You have finished ${ctx.attempts} practice tests so far. That is steady, honest progress.`)
  }
  return {
    eyebrow: GREETING[part],
    title: ctx.attempts > 0 ? `Welcome back, ${N}!` : `Welcome, ${N}!`,
    line: pick(lines, rng),
  }
}

// ------------------------------------------------------------------------------------------- result

export type Tone = 'celebrate' | 'good' | 'steady' | 'gentle'

export interface ResultMessage {
  tone: Tone
  headline: string
  line: string
  /** Facts about this particular attempt (comparison with last time, strongest / weakest week, ...). */
  insights: string[]
  /** 0 = none, 1 = a burst of confetti, 2 = a longer celebration. */
  confetti: 0 | 1 | 2
}

interface Band {
  tone: Tone
  confetti: 0 | 1 | 2
  headlines: readonly string[]
  lines: readonly string[]
}

const BANDS: Record<'perfect' | 'excellent' | 'good' | 'steady' | 'gentle' | 'none', Band> = {
  perfect: {
    tone: 'celebrate',
    confetti: 2,
    headlines: [
      `Full marks, ${N}. Congratulations!`,
      `A perfect score, ${N}. Congratulations!`,
      `Every answer correct, ${N}. Wonderful!`,
    ],
    lines: [
      'Not a single question missed. That is thorough preparation, and it shows.',
      'Every one of them answered correctly. An outstanding round.',
      'A flawless round. Another week would be a fine next step.',
    ],
  },
  excellent: {
    tone: 'celebrate',
    confetti: 2,
    headlines: [`Excellent work, ${N}!`, `A very strong result, ${N}.`, `Wonderful, ${N}. Congratulations!`],
    lines: [
      'Clearly well prepared. A quick look at the few misses below and everything is in place.',
      'Strong across the board. The questions missed are small gaps, easy to close.',
      'This is exactly the standard to aim for. Please keep this rhythm going.',
    ],
  },
  good: {
    tone: 'good',
    confetti: 1,
    headlines: [`Well done, ${N}!`, `A good result, ${N}.`, `You are on the right track, ${N}.`],
    lines: [
      'The questions missed are the quickest marks to win back.',
      'Most of this is already solid. Reading the answers below once will make the next round even better.',
      'A little more practice on the missed questions, and the result will be comfortably ahead.',
    ],
  },
  steady: {
    tone: 'steady',
    confetti: 0,
    headlines: [`Good effort, ${N}.`, `You are getting there, ${N}.`, `You can do it, ${N}. Please keep going.`],
    lines: [
      'A fair part of this is already known. Going through the answers below and trying again will help a great deal.',
      'Half the work is knowing where the gaps are, and that is now clear. One more round will help.',
      'Progress comes in small steps. Please review the answers, then take the same week once more.',
    ],
  },
  gentle: {
    tone: 'gentle',
    confetti: 0,
    headlines: [`Every attempt counts, ${N}.`, `This is how practice works, ${N}.`, `Please do not be discouraged, ${N}.`],
    lines: [
      'A practice test is meant to show what to work on, not to judge. Please read the answers below and try once more.',
      `Now the areas to focus on are clear, and that is useful. You can do it, ${N}.`,
      'Difficult rounds teach the most. After a short break, please read the answers and try again. Let us go on.',
    ],
  },
  none: {
    tone: 'gentle',
    confetti: 0,
    headlines: ['Nothing was answered this time.', `That is quite alright, ${N}.`],
    lines: [
      'Please start again with a short exam. There is no negative marking, so an attempt can only help.',
      'Choose one week, take your time, and answer what you can. Every question tried is practice.',
    ],
  },
}

function bandFor(g: Pick<GradedExam, 'percent' | 'correct' | 'wrong'>): keyof typeof BANDS {
  if (g.correct + g.wrong === 0) return 'none'
  if (g.percent === 100) return 'perfect'
  if (g.percent >= 85) return 'excellent'
  if (g.percent >= 60) return 'good'
  if (g.percent >= 40) return 'steady'
  return 'gentle'
}

const pct = (c: number, t: number) => (t > 0 ? Math.round((c / t) * 100) : 0)
const sameWeeks = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && [...a].sort((x, y) => x - y).every((w, i) => w === [...b].sort((x, y) => x - y)[i])

/** The most recent earlier attempt of the same kind (same exam type and weeks). `history` is newest first. */
export function previousAttempt(
  history: readonly HistoryEntry[],
  current: Pick<HistoryEntry, 'id' | 'mode' | 'weeks'>,
): HistoryEntry | undefined {
  const at = history.findIndex((h) => h.id === current.id)
  const earlier = at >= 0 ? history.slice(at + 1) : history
  return earlier.find((h) => h.mode === current.mode && sameWeeks(h.weeks, current.weeks))
}

export interface ResultOptions {
  /** Makes the wording stable for one exam (use the exam id). */
  seed: string
  previous?: HistoryEntry
  /** Seconds that were left on the clock when she submitted (null = untimed). */
  timeLeftSec?: number | null
}

export function resultMessage(graded: GradedExam, opts: ResultOptions): ResultMessage {
  const rng = seededRng(opts.seed)
  const band = BANDS[bandFor(graded)]
  const headline = pick(band.headlines, rng)
  const line = pick(band.lines, rng)

  const insights: string[] = []

  const prev = opts.previous
  if (prev && graded.total > 0) {
    const now = graded.percent
    const before = pct(prev.correct, prev.total)
    if (now > before) insights.push(`Up from ${prev.correct} of ${prev.total} last time. That is real progress.`)
    else if (now === before) insights.push(`Level with last time (${prev.correct} of ${prev.total}). Steady.`)
    else insights.push(`Last time it was ${prev.correct} of ${prev.total}. A small dip is normal, and reviewing the answers below should help.`)
  }

  if (graded.byWeek.length > 1) {
    const rated = graded.byWeek.map((w) => ({ ...w, rate: pct(w.correct, w.total) }))
    const best = [...rated].sort((a, b) => b.rate - a.rate || b.total - a.total)[0]
    const worst = [...rated].sort((a, b) => a.rate - b.rate || b.total - a.total)[0]
    if (best.rate !== worst.rate) {
      insights.push(`Strongest: Week ${best.week} (${best.correct} of ${best.total}).`)
      insights.push(`Worth another look: Week ${worst.week} (${worst.correct} of ${worst.total}).`)
    }
  }

  if (graded.skipped > 0 && graded.skipped < graded.total) {
    insights.push(
      `${graded.skipped} ${graded.skipped === 1 ? 'question was' : 'questions were'} left unanswered. There is no negative marking, so an educated guess can only help.`,
    )
  }

  if (opts.timeLeftSec != null && opts.timeLeftSec >= 60) {
    const m = Math.floor(opts.timeLeftSec / 60)
    insights.push(`You finished with ${m} ${m === 1 ? 'minute' : 'minutes'} to spare.`)
  }

  return { tone: band.tone, headline, line, insights: insights.slice(0, 4), confetti: band.confetti }
}

// ------------------------------------------------------------------------------------ suggestions

export interface Suggestion {
  week: number
  correct: number
  total: number
}

/**
 * Looks at the recent attempts and names the week she has struggled with most, so the home page can offer to
 * practise it. Needs at least 5 answered questions in a week and an accuracy below 80%.
 */
export function suggestPractice(
  history: readonly HistoryEntry[],
  hasQuestions: (week: number) => boolean,
): Suggestion | null {
  const totals = new Map<number, { correct: number; total: number }>()
  for (const entry of history.slice(0, 10)) {
    for (const w of entry.byWeek ?? []) {
      const row = totals.get(w.week) ?? { correct: 0, total: 0 }
      row.correct += w.correct
      row.total += w.total
      totals.set(w.week, row)
    }
  }
  const candidates = [...totals.entries()]
    .map(([week, t]) => ({ week, ...t }))
    .filter((w) => w.total >= 5 && w.correct / w.total < 0.8 && hasQuestions(w.week))
    .sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total)
  return candidates[0] ?? null
}
