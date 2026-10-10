/** Where the correct answer came from. */
export type AnswerSource =
  /** Taken from NPTEL's "Accepted answer" line. */
  | 'nptel'
  /** The source file had no answer key; the answer was worked out separately. */
  | 'inferred'
  /** The question itself was written from a programming assignment (not an MCQ originally). */
  | 'derived'

/** A question as written in src/data/weeks/*.ts */
export interface RawQuestion {
  /** The question text. */
  q: string
  /** Optional code snippet shown under the question in a monospace block. */
  code?: string
  /** Answer options WITHOUT the "a." / "b." prefix. */
  options: string[]
  /** Index (0-based) of the correct option. */
  answer: number
  /** Other options that are ALSO genuinely correct (the question is ambiguous); they score full marks too. */
  alsoCorrect?: number[]
  /** Short explanation shown on the result page. */
  explain?: string
  /** Defaults to 'nptel'. */
  source?: AnswerSource
  /** Never reorder this question's options (e.g. "None of the above"). */
  fixedOptions?: boolean
}

export interface WeekFile {
  week: number
  title: string
  /** Default answer source for every question in this file (a question can override it). */
  source?: AnswerSource
  questions: RawQuestion[]
}

export interface Question extends RawQuestion {
  /** Stable id, e.g. "w3-5". */
  id: string
  week: number
  source: AnswerSource
}

export type ExamMode = 'week' | 'mixed' | 'random'

export interface ExamConfig {
  mode: ExamMode
  /** Selected weeks (ignored for 'random'). */
  weeks: number[]
  /** Number of questions (already resolved against the pool size). */
  count: number
  /** Minutes allowed, or null for untimed. */
  timerMinutes: number | null
  shuffleQuestions: boolean
  shuffleOptions: boolean
}

export interface ExamItem {
  id: string
  /** order[displayPosition] = original option index */
  order: number[]
  /** Fingerprint of the question when the exam was created; a saved exam ignores questions edited since. */
  sig: string
}

export interface ExamSession {
  id: string
  config: ExamConfig
  items: ExamItem[]
  /** questionId -> ORIGINAL option index */
  answers: Record<string, number>
  /** question ids flagged for review */
  marked: string[]
  /** index of the question currently on screen */
  current: number
  startedAt: number
  /** epoch ms when the timer runs out, or null if untimed */
  endsAt: number | null
  submittedAt: number | null
}

export type QuestionStatus = 'correct' | 'wrong' | 'skipped'

export interface GradedItem {
  question: Question
  order: number[]
  /** ORIGINAL option index the user picked */
  chosen: number | null
  status: QuestionStatus
  marked: boolean
}

export interface WeekBreakdown {
  week: number
  total: number
  correct: number
}

export interface GradedExam {
  items: GradedItem[]
  total: number
  correct: number
  wrong: number
  skipped: number
  percent: number
  durationSec: number
  byWeek: WeekBreakdown[]
}

export interface HistoryEntry {
  id: string
  at: number
  mode: ExamMode
  weeks: number[]
  total: number
  correct: number
  wrong: number
  skipped: number
  durationSec: number
  /** Per-week results; missing on entries saved by older versions. */
  byWeek?: WeekBreakdown[]
}
