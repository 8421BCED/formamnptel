import { describe, expect, it } from 'vitest'
import type { ExamConfig, ExamSession, Question } from '../types'
import {
  buildPool,
  countAnswered,
  createSession,
  gradeSession,
  hasFixedOptions,
  isCorrectChoice,
  mulberry32,
  questionSig,
  shuffle,
  stateOf,
  suggestMinutes,
} from './exam'

function q(id: string, week: number, over: Partial<Question> = {}): Question {
  return {
    id,
    week,
    q: `Question ${id}?`,
    options: ['A', 'B', 'C', 'D'],
    answer: 1,
    source: 'nptel',
    ...over,
  }
}

const bank: Question[] = [
  q('w1-1', 1),
  q('w1-2', 1),
  q('w1-3', 1),
  q('w2-1', 2),
  q('w2-2', 2),
  q('w3-1', 3),
  // same wording as w3-1, so it must be de-duplicated when both weeks are in the pool
  q('w4-1', 4, { q: 'Question w3-1?' }),
]
const lookup = new Map(bank.map((x) => [x.id, x]))

const base: ExamConfig = {
  mode: 'mixed',
  weeks: [1, 2],
  count: 100,
  timerMinutes: null,
  shuffleQuestions: false,
  shuffleOptions: false,
}

describe('shuffle', () => {
  it('keeps every element and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const out = shuffle(input, mulberry32(7))
    expect([...out].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('is deterministic for a given seed', () => {
    expect(shuffle([1, 2, 3, 4, 5, 6], mulberry32(3))).toEqual(shuffle([1, 2, 3, 4, 5, 6], mulberry32(3)))
  })
})

describe('buildPool', () => {
  it('week/mixed modes only draw from the chosen weeks', () => {
    const pool = buildPool({ mode: 'mixed', weeks: [2, 3] }, bank)
    expect(pool.map((x) => x.id)).toEqual(['w2-1', 'w2-2', 'w3-1'])
  })

  it('random mode ignores the week list and uses everything', () => {
    expect(buildPool({ mode: 'random', weeks: [] }, bank)).toHaveLength(6) // 7 minus one duplicate
  })

  it('drops duplicate questions that appear in several weeks', () => {
    const ids = buildPool({ mode: 'mixed', weeks: [3, 4] }, bank).map((x) => x.id)
    expect(ids).toEqual(['w3-1'])
  })
})

describe('createSession', () => {
  it('returns null when nothing is selected', () => {
    expect(createSession({ ...base, weeks: [] }, bank)).toBeNull()
    expect(createSession({ ...base, weeks: [9] }, bank)).toBeNull()
  })

  it('caps the count at the pool size and keeps bank order when not shuffling', () => {
    const s = createSession({ ...base, count: 100 }, bank)!
    expect(s.config.count).toBe(5)
    expect(s.items.map((i) => i.id)).toEqual(['w1-1', 'w1-2', 'w1-3', 'w2-1', 'w2-2'])
  })

  it('draws a random subset of the requested size without repeats', () => {
    const s = createSession({ ...base, count: 3, shuffleQuestions: true }, bank, mulberry32(11))!
    const ids = s.items.map((i) => i.id)
    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
    for (const id of ids) expect(['w1-1', 'w1-2', 'w1-3', 'w2-1', 'w2-2']).toContain(id)
  })

  it('shuffled option orders are permutations; unshuffled are the identity', () => {
    const shuffled = createSession({ ...base, shuffleOptions: true }, bank, mulberry32(5))!
    for (const it of shuffled.items) expect([...it.order].sort()).toEqual([0, 1, 2, 3])
    const plain = createSession(base, bank)!
    for (const it of plain.items) expect(it.order).toEqual([0, 1, 2, 3])
  })

  it('never shuffles options that say "None of the above"', () => {
    const tricky = [q('w1-1', 1, { options: ['A', 'B', 'C', 'None of the above'] })]
    for (let seed = 0; seed < 20; seed++) {
      const s = createSession({ ...base, shuffleOptions: true }, tricky, mulberry32(seed))!
      expect(s.items[0].order).toEqual([0, 1, 2, 3])
    }
    expect(hasFixedOptions(tricky[0])).toBe(true)
    expect(hasFixedOptions(q('x', 1))).toBe(false)
    expect(hasFixedOptions(q('x', 1, { fixedOptions: true }))).toBe(true)
  })

  it('sets the deadline only when a timer is chosen', () => {
    expect(createSession(base, bank, Math.random, 1000)!.endsAt).toBeNull()
    expect(createSession({ ...base, timerMinutes: 10 }, bank, Math.random, 1000)!.endsAt).toBe(1000 + 600_000)
  })
})

describe('gradeSession', () => {
  function session(answers: Record<string, number>, marked: string[] = []): ExamSession {
    return {
      ...createSession(base, bank, Math.random, 0)!,
      answers,
      marked,
      submittedAt: 90_000,
    }
  }

  it('counts correct, wrong and skipped', () => {
    // every question's correct answer is index 1
    const g = gradeSession(session({ 'w1-1': 1, 'w1-2': 0, 'w1-3': 1 }), lookup)
    expect(g.total).toBe(5)
    expect(g.correct).toBe(2)
    expect(g.wrong).toBe(1)
    expect(g.skipped).toBe(2)
    expect(g.percent).toBe(40)
    expect(g.durationSec).toBe(90)
  })

  it('grades against the ORIGINAL option index even when options were shuffled', () => {
    const s = createSession({ ...base, weeks: [1], shuffleOptions: true }, bank, mulberry32(2))!
    // the user clicks whatever is displayed in the position that holds the right answer
    const first = s.items[0]
    const displayPos = first.order.indexOf(1)
    s.answers[first.id] = first.order[displayPos]
    const g = gradeSession(s, lookup)
    expect(g.items[0].status).toBe('correct')
  })

  it('accepts every option listed in alsoCorrect, and nothing else', () => {
    const ambiguous = [q('w1-1', 1, { answer: 1, alsoCorrect: [2] })]
    const map = new Map(ambiguous.map((x) => [x.id, x]))
    const run = (choice: number) => {
      const s = createSession({ ...base, weeks: [1] }, ambiguous, Math.random, 0)!
      s.answers = { 'w1-1': choice }
      return gradeSession(s, map).items[0].status
    }
    expect(run(1)).toBe('correct')
    expect(run(2)).toBe('correct')
    expect(run(0)).toBe('wrong')
    expect(run(3)).toBe('wrong')
    expect(isCorrectChoice(ambiguous[0], 2)).toBe(true)
    expect(isCorrectChoice(q('x', 1), 2)).toBe(false)
  })

  it('treats an answer of index 0 as answered, not skipped', () => {
    const g = gradeSession(session({ 'w1-1': 0 }), lookup)
    expect(g.items[0].status).toBe('wrong')
    expect(g.skipped).toBe(4)
  })

  it('breaks results down by week', () => {
    const g = gradeSession(session({ 'w1-1': 1, 'w2-1': 1, 'w2-2': 1 }), lookup)
    expect(g.byWeek).toEqual([
      { week: 1, total: 3, correct: 1 },
      { week: 2, total: 2, correct: 2 },
    ])
  })

  it('ignores questions that were removed from the bank', () => {
    const s = session({})
    s.items.push({ id: 'gone', order: [0, 1, 2, 3], sig: '' })
    expect(gradeSession(s, lookup).total).toBe(5)
  })

  it('does not divide by zero for an empty exam', () => {
    const s = session({})
    s.items = []
    expect(gradeSession(s, lookup).percent).toBe(0)
  })
})

describe('questionSig', () => {
  it('is stable, and changes when anything that defines the question changes', () => {
    const a = q('w1-1', 1)
    expect(questionSig(a)).toBe(questionSig({ ...a }))
    expect(questionSig(a)).not.toBe(questionSig({ ...a, answer: 2 }))
    expect(questionSig(a)).not.toBe(questionSig({ ...a, q: 'Different?' }))
    expect(questionSig(a)).not.toBe(questionSig({ ...a, options: ['A', 'B', 'C', 'X'] }))
    expect(questionSig(a)).not.toBe(questionSig({ ...a, code: 'int x;' }))
    expect(questionSig(a)).not.toBe(questionSig({ ...a, alsoCorrect: [2] }))
  })

  it('is recorded on every exam item', () => {
    const s = createSession(base, bank, Math.random, 0)!
    for (const it of s.items) expect(it.sig).toBe(questionSig(lookup.get(it.id)!))
  })
})

describe('palette helpers', () => {
  it('reports each question state', () => {
    const s = createSession(base, bank, Math.random, 0)!
    s.answers = { 'w1-2': 1, 'w1-3': 1 }
    s.marked = ['w1-3', 'w2-1']
    s.current = 0
    expect(stateOf(s, 0)).toBe('current')
    expect(stateOf(s, 1)).toBe('answered')
    expect(stateOf(s, 2)).toBe('marked-answered')
    expect(stateOf(s, 3)).toBe('marked')
    expect(stateOf(s, 4)).toBe('unanswered')
    expect(countAnswered(s)).toBe(2)
  })

  it('suggests one minute per question with a 5 minute floor', () => {
    expect(suggestMinutes(3)).toBe(5)
    expect(suggestMinutes(25)).toBe(25)
  })
})
