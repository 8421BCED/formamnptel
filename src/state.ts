import { BANK_BY_ID } from './data/bank'
import { gradeSession, toHistoryEntry } from './lib/exam'
import { loadHistory, loadSession, mergeHistory } from './lib/storage'
import type { ExamSession, HistoryEntry } from './types'

export type Screen = 'home' | 'setup' | 'exam' | 'result'

export interface AppState {
  screen: Screen
  session: ExamSession | null
  history: HistoryEntry[]
}

export type Action =
  | { type: 'goto'; screen: Screen }
  | { type: 'start'; session: ExamSession }
  | { type: 'answer'; id: string; value: number | null }
  | { type: 'mark'; id: string }
  | { type: 'jump'; index: number }
  | { type: 'submit'; at: number }
  | { type: 'discard' }
  | { type: 'clearHistory' }

function submit(state: AppState, at: number): AppState {
  const { session } = state
  if (!session || session.submittedAt !== null) return state
  const submitted: ExamSession = { ...session, submittedAt: at }
  const entry = toHistoryEntry(submitted, gradeSession(submitted, BANK_BY_ID))
  return { screen: 'result', session: submitted, history: mergeHistory(state.history, entry) }
}

export function reducer(state: AppState, action: Action): AppState {
  const { session } = state
  switch (action.type) {
    case 'goto':
      return { ...state, screen: action.screen }

    case 'start':
      return { ...state, screen: 'exam', session: action.session }

    case 'answer': {
      if (!session || session.submittedAt !== null) return state
      const answers = { ...session.answers }
      if (action.value === null) delete answers[action.id]
      else answers[action.id] = action.value
      return { ...state, session: { ...session, answers } }
    }

    case 'mark': {
      if (!session || session.submittedAt !== null) return state
      const marked = session.marked.includes(action.id)
        ? session.marked.filter((m) => m !== action.id)
        : [...session.marked, action.id]
      return { ...state, session: { ...session, marked } }
    }

    case 'jump': {
      if (!session || session.submittedAt !== null) return state
      const current = Math.min(Math.max(0, action.index), session.items.length - 1)
      return { ...state, session: { ...session, current } }
    }

    case 'submit':
      return submit(state, action.at)

    case 'clearHistory':
      // Removes the list of attempts and the saved finished result. An exam that is still in progress is kept.
      return {
        ...state,
        history: [],
        session: session && session.submittedAt === null ? session : null,
        screen: state.screen === 'result' ? 'home' : state.screen,
      }

    case 'discard':
      return { ...state, screen: 'home', session: null }
  }
}

/** Restores the saved exam. A timed exam whose clock ran out while the tab was closed is submitted right away. */
export function initState(now: number = Date.now()): AppState {
  const state: AppState = { screen: 'home', session: loadSession(BANK_BY_ID), history: loadHistory() }
  const s = state.session
  if (s && s.submittedAt === null && s.endsAt !== null && s.endsAt <= now) {
    return { ...submit(state, s.endsAt), screen: 'home' }
  }
  return state
}
