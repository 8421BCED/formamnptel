import { describe, expect, it } from 'vitest'
import { BANK, WEEK_FILES, WEEK_NUMBERS, weekInfos } from './bank'

describe('question bank', () => {
  it('is not empty', () => {
    expect(BANK.length).toBeGreaterThan(100)
  })

  it('has unique ids', () => {
    const ids = BANK.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only uses weeks 0-12, once per file', () => {
    const weeks = WEEK_FILES.map((f) => f.week)
    expect(new Set(weeks).size).toBe(weeks.length)
    for (const w of weeks) expect(WEEK_NUMBERS).toContain(w)
  })

  it.each(BANK.map((q) => [q.id, q] as const))('%s is well-formed', (_id, q) => {
    expect(q.q.trim().length).toBeGreaterThan(5)
    expect(q.options.length).toBeGreaterThanOrEqual(2)
    expect(q.options.length).toBeLessThanOrEqual(6)
    expect(Number.isInteger(q.answer)).toBe(true)
    expect(q.answer).toBeGreaterThanOrEqual(0)
    expect(q.answer).toBeLessThan(q.options.length)
    for (const a of q.alsoCorrect ?? []) {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThan(q.options.length)
      expect(a).not.toBe(q.answer)
    }
    for (const o of q.options) expect(o.trim().length).toBeGreaterThan(0)
    // an option that appears twice would make the "correct" answer ambiguous
    expect(new Set(q.options.map((o) => o.trim())).size).toBe(q.options.length)
  })

  it('matches the real course: Week 0 has 20 questions and Weeks 1-12 have 10 each', () => {
    const counts = Object.fromEntries(weekInfos().map((w) => [w.week, w.count]))
    expect(counts).toEqual({ 0: 20, 1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 10 })
    expect(BANK).toHaveLength(140)
  })

  it('reports a count per week 0-12', () => {
    const infos = weekInfos()
    expect(infos).toHaveLength(13)
    expect(infos.reduce((n, w) => n + w.count, 0)).toBe(BANK.length)
  })
})
