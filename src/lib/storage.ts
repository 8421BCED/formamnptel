import type { ExamSession, HistoryEntry, Question } from '../types'
import { questionSig } from './exam'

const SESSION_KEY = 'nptel-java:session:v1'
const HISTORY_KEY = 'nptel-java:history:v1'
const HISTORY_LIMIT = 15

// Browsers can throw on any storage access (private mode, blocked cookies), so every call is guarded.
function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable - the exam still works, it just will not survive a refresh */
  }
}

function clear(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function looksLikeSession(v: unknown): v is ExamSession {
  const s = v as Partial<ExamSession> | null
  return (
    !!s &&
    typeof s.id === 'string' &&
    typeof s.startedAt === 'number' &&
    typeof s.current === 'number' &&
    Array.isArray(s.items) &&
    Array.isArray(s.marked) &&
    !!s.answers &&
    typeof s.answers === 'object' &&
    !!s.config &&
    typeof s.config === 'object'
  )
}

/** Loads the saved exam, dropping questions that no longer exist (e.g. after the question bank was edited). */
export function loadSession(lookup: ReadonlyMap<string, Question>): ExamSession | null {
  const raw = read(SESSION_KEY)
  if (!looksLikeSession(raw)) return null
  // Keep only questions that still exist AND are unchanged, so edits to the bank can never
  // make a saved exam point at a different question than the one the student answered.
  const items = raw.items.filter((it) => {
    const q = lookup.get(it.id)
    return !!q && Array.isArray(it.order) && it.sig === questionSig(q)
  })
  if (items.length === 0) return null
  return { ...raw, items, current: Math.min(Math.max(0, raw.current), items.length - 1) }
}

export const saveSession = (session: ExamSession): void => write(SESSION_KEY, session)
export const clearSession = (): void => clear(SESSION_KEY)

export function loadHistory(): HistoryEntry[] {
  const raw = read(HISTORY_KEY)
  return Array.isArray(raw) ? (raw as HistoryEntry[]).filter((e) => e && typeof e.id === 'string') : []
}

/** Pure: newest first, one entry per exam, capped. */
export function mergeHistory(history: readonly HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  return [entry, ...history.filter((h) => h.id !== entry.id)].slice(0, HISTORY_LIMIT)
}

export const saveHistory = (history: readonly HistoryEntry[]): void => write(HISTORY_KEY, history)
