import { describe, expect, it } from 'vitest'
import { RECIPIENT } from '../config'
import type { GradedExam, HistoryEntry } from '../types'
import { mulberry32 } from './exam'
import { dayPart, hashSeed, previousAttempt, resultMessage, suggestPractice, welcome } from './messages'

function graded(correct: number, wrong: number, skipped: number, byWeek: GradedExam['byWeek'] = []): GradedExam {
  const total = correct + wrong + skipped
  return {
    items: [],
    total,
    correct,
    wrong,
    skipped,
    percent: total ? Math.round((correct / total) * 100) : 0,
    durationSec: 100,
    byWeek,
  }
}

function entry(id: string, correct: number, total: number, over: Partial<HistoryEntry> = {}): HistoryEntry {
  return { id, at: 0, mode: 'week', weeks: [2], total, correct, wrong: total - correct, skipped: 0, durationSec: 60, ...over }
}

describe('dayPart', () => {
  it('splits the day at 5, 12, 17 and 21', () => {
    expect(dayPart(4)).toBe('night')
    expect(dayPart(5)).toBe('morning')
    expect(dayPart(11)).toBe('morning')
    expect(dayPart(12)).toBe('afternoon')
    expect(dayPart(16)).toBe('afternoon')
    expect(dayPart(17)).toBe('evening')
    expect(dayPart(20)).toBe('evening')
    expect(dayPart(21)).toBe('night')
    expect(dayPart(0)).toBe('night')
  })
})

describe('welcome', () => {
  const at = (h: number) => new Date(2026, 9, 10, h, 30)

  it('greets by the time of day and uses the name', () => {
    expect(welcome(at(8), { attempts: 0 }, mulberry32(1)).eyebrow).toBe('Good morning')
    expect(welcome(at(13), { attempts: 0 }, mulberry32(1)).eyebrow).toBe('Good afternoon')
    expect(welcome(at(19), { attempts: 0 }, mulberry32(1)).eyebrow).toBe('Good evening')
    expect(welcome(at(23), { attempts: 0 }, mulberry32(1)).eyebrow).toBe('Hello')
    expect(welcome(at(8), { attempts: 0 }, mulberry32(1)).title).toBe(`Welcome, ${RECIPIENT}!`)
    expect(welcome(at(8), { attempts: 2 }, mulberry32(1)).title).toBe(`Welcome back, ${RECIPIENT}!`)
  })

  it('has real variety: different seeds give different lines for the same moment', () => {
    const lines = new Set<string>()
    for (let seed = 0; seed < 60; seed++) lines.add(welcome(at(9), { attempts: 0 }, mulberry32(seed)).line)
    expect(lines.size).toBeGreaterThanOrEqual(3)
  })

  it('can mention the last result once she has practised before', () => {
    const lines = new Set<string>()
    for (let seed = 0; seed < 200; seed++) {
      lines.add(welcome(at(9), { attempts: 4, last: { correct: 7, total: 10 } }, mulberry32(seed)).line)
    }
    expect([...lines].some((l) => l.includes('7 out of 10'))).toBe(true)
    expect([...lines].some((l) => l.includes('4 practice tests'))).toBe(true)
  })

  it('never leaves a placeholder or an em dash in any line', () => {
    for (let h = 0; h < 24; h++) {
      for (let seed = 0; seed < 40; seed++) {
        const w = welcome(at(h), { attempts: 5, last: { correct: 1, total: 2 } }, mulberry32(seed))
        for (const text of [w.eyebrow, w.title, w.line]) {
          expect(text).not.toMatch(/undefined|NaN|\$\{|—/)
          expect(text.length).toBeGreaterThan(3)
        }
      }
    }
  })
})

describe('resultMessage', () => {
  const opts = { seed: 'exam-1' }

  it('chooses confetti by how well it went', () => {
    expect(resultMessage(graded(10, 0, 0), opts).confetti).toBe(2) // perfect
    expect(resultMessage(graded(9, 1, 0), opts).confetti).toBe(2) // 90%
    expect(resultMessage(graded(7, 3, 0), opts).confetti).toBe(1) // 70%
    expect(resultMessage(graded(6, 4, 0), opts).confetti).toBe(1) // 60%
    expect(resultMessage(graded(5, 5, 0), opts).confetti).toBe(0) // 50%
    expect(resultMessage(graded(1, 9, 0), opts).confetti).toBe(0)
  })

  it('picks a tone for each band, including nothing answered', () => {
    expect(resultMessage(graded(10, 0, 0), opts).tone).toBe('celebrate')
    expect(resultMessage(graded(7, 3, 0), opts).tone).toBe('good')
    expect(resultMessage(graded(5, 5, 0), opts).tone).toBe('steady')
    expect(resultMessage(graded(2, 8, 0), opts).tone).toBe('gentle')
    const none = resultMessage(graded(0, 0, 10), opts)
    expect(none.tone).toBe('gentle')
    expect(none.confetti).toBe(0)
  })

  it('is stable for one exam but varies between exams', () => {
    const a = resultMessage(graded(7, 3, 0), { seed: 'same' })
    const b = resultMessage(graded(7, 3, 0), { seed: 'same' })
    expect(a).toEqual(b)
    const headlines = new Set<string>()
    for (let i = 0; i < 80; i++) headlines.add(resultMessage(graded(7, 3, 0), { seed: `exam-${i}` }).headline)
    expect(headlines.size).toBeGreaterThanOrEqual(2)
  })

  it('compares with last time', () => {
    const better = resultMessage(graded(8, 2, 0), { seed: 's', previous: entry('p', 6, 10) })
    expect(better.insights[0]).toContain('Up from 6 of 10')
    const same = resultMessage(graded(6, 4, 0), { seed: 's', previous: entry('p', 6, 10) })
    expect(same.insights[0]).toContain('Level with last time')
    const worse = resultMessage(graded(4, 6, 0), { seed: 's', previous: entry('p', 6, 10) })
    expect(worse.insights[0]).toContain('small dip')
  })

  it('names the strongest and the weakest week when several were practised', () => {
    const g = graded(11, 9, 0, [
      { week: 2, total: 10, correct: 9 },
      { week: 5, total: 10, correct: 2 },
    ])
    const text = resultMessage(g, opts).insights.join(' ')
    expect(text).toContain('Strongest: Week 2 (9 of 10)')
    expect(text).toContain('Week 5 (2 of 10)')
  })

  it('does not name a weakest week when every week went equally', () => {
    const g = graded(10, 10, 0, [
      { week: 2, total: 10, correct: 5 },
      { week: 3, total: 10, correct: 5 },
    ])
    expect(resultMessage(g, opts).insights.join(' ')).not.toContain('Strongest')
  })

  it('reminds her there is no negative marking when questions were skipped, and reports time to spare', () => {
    const text = resultMessage(graded(5, 2, 3), { seed: 's', timeLeftSec: 185 }).insights.join(' ')
    expect(text).toContain('3 questions were left unanswered')
    expect(text).toContain('no negative marking')
    expect(text).toContain('3 minutes to spare')
    expect(resultMessage(graded(5, 4, 1), { seed: 's' }).insights.join(' ')).toContain('1 question was left')
  })

  it('has clean wording everywhere', () => {
    for (const g of [graded(10, 0, 0), graded(9, 1, 0), graded(7, 3, 0), graded(5, 5, 0), graded(1, 9, 0), graded(0, 0, 10)]) {
      for (let i = 0; i < 40; i++) {
        const m = resultMessage(g, { seed: `x${i}`, previous: entry('p', 5, 10), timeLeftSec: 120 })
        for (const text of [m.headline, m.line, ...m.insights]) expect(text).not.toMatch(/undefined|NaN|\$\{|—/)
      }
    }
  })
})

describe('previousAttempt', () => {
  const history = [
    entry('c', 7, 10, { weeks: [3] }),
    entry('b', 5, 10, { weeks: [2] }),
    entry('a', 3, 10, { weeks: [2] }),
  ]

  it('finds the newest earlier attempt of the same kind', () => {
    expect(previousAttempt(history, { id: 'c', mode: 'week', weeks: [3] })).toBeUndefined()
    expect(previousAttempt(history, { id: 'b', mode: 'week', weeks: [2] })?.id).toBe('a')
    expect(previousAttempt(history, { id: 'zzz', mode: 'week', weeks: [2] })?.id).toBe('b')
  })

  it('ignores attempts with a different exam type or different weeks', () => {
    expect(previousAttempt(history, { id: 'b', mode: 'mixed', weeks: [2] })).toBeUndefined()
    expect(previousAttempt(history, { id: 'b', mode: 'week', weeks: [2, 3] })).toBeUndefined()
  })
})

describe('suggestPractice', () => {
  const has = () => true

  it('suggests the week she struggles with most', () => {
    const history = [
      entry('b', 6, 20, { byWeek: [{ week: 4, total: 10, correct: 9 }, { week: 5, total: 10, correct: 3 }] }),
      entry('a', 8, 10, { byWeek: [{ week: 5, total: 5, correct: 2 }] }),
    ]
    expect(suggestPractice(history, has)).toEqual({ week: 5, correct: 5, total: 15 })
  })

  it('stays quiet when there is too little data or no weak week', () => {
    expect(suggestPractice([], has)).toBeNull()
    expect(suggestPractice([entry('a', 1, 3, { byWeek: [{ week: 5, total: 3, correct: 1 }] })], has)).toBeNull()
    expect(suggestPractice([entry('a', 9, 10, { byWeek: [{ week: 5, total: 10, correct: 9 }] })], has)).toBeNull()
    expect(suggestPractice([entry('a', 5, 10)], has)).toBeNull() // old entry without byWeek
  })

  it('skips weeks that have no questions', () => {
    const history = [entry('a', 2, 10, { byWeek: [{ week: 5, total: 10, correct: 2 }] })]
    expect(suggestPractice(history, (w) => w !== 5)).toBeNull()
  })
})

describe('hashSeed', () => {
  it('is deterministic', () => {
    expect(hashSeed('abc')).toBe(hashSeed('abc'))
    expect(hashSeed('abc')).not.toBe(hashSeed('abd'))
  })
})
