import { describe, expect, it } from 'vitest'
import { BANK } from './data/bank'
import { createSession } from './lib/exam'
import { reducer, type AppState } from './state'
import type { ExamConfig, HistoryEntry } from './types'

const config: ExamConfig = {
  mode: 'week',
  weeks: [2],
  count: 10,
  timerMinutes: null,
  shuffleQuestions: false,
  shuffleOptions: false,
}

const entry = (id: string): HistoryEntry => ({
  id,
  at: 0,
  mode: 'week',
  weeks: [2],
  total: 10,
  correct: 6,
  wrong: 4,
  skipped: 0,
  durationSec: 120,
})

function stateWith(submitted: boolean, screen: AppState['screen'] = 'home'): AppState {
  const session = createSession(config, BANK)!
  return {
    screen,
    session: { ...session, submittedAt: submitted ? session.startedAt + 1000 : null },
    history: [entry('a'), entry('b')],
  }
}

describe('clearHistory', () => {
  it('empties the history and the saved finished result', () => {
    const next = reducer(stateWith(true), { type: 'clearHistory' })
    expect(next.history).toEqual([])
    expect(next.session).toBeNull()
  })

  it('never throws away an exam that is still in progress', () => {
    const before = stateWith(false)
    const next = reducer(before, { type: 'clearHistory' })
    expect(next.history).toEqual([])
    expect(next.session).toEqual(before.session)
  })

  it('leaves the result page if it was open, because the result is gone', () => {
    expect(reducer(stateWith(true, 'result'), { type: 'clearHistory' }).screen).toBe('home')
    expect(reducer(stateWith(false, 'exam'), { type: 'clearHistory' }).screen).toBe('exam')
  })

  it('is harmless when there is nothing to clear', () => {
    const empty: AppState = { screen: 'home', session: null, history: [] }
    expect(reducer(empty, { type: 'clearHistory' })).toEqual(empty)
  })
})
