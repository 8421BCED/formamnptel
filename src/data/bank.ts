import type { Question, WeekFile } from '../types'

/** NPTEL "Programming in Java" runs Week 0 (orientation) to Week 12. */
export const WEEK_NUMBERS: readonly number[] = Array.from({ length: 13 }, (_, i) => i)

/** Turns week files into a flat, ordered list of questions with stable ids ("w3-5" = 5th question of Week 3). */
export function buildBank(files: readonly WeekFile[]): Question[] {
  return [...files]
    .sort((a, b) => a.week - b.week)
    .flatMap((file) =>
      file.questions.map((q, i) => ({
        ...q,
        id: `w${file.week}-${i + 1}`,
        week: file.week,
        source: q.source ?? file.source ?? 'nptel',
      })),
    )
}

// Every file in ./weeks is picked up automatically - drop in week10.ts and it shows up in the app.
const modules = import.meta.glob<{ default: WeekFile }>('./weeks/*.ts', { eager: true })
export const WEEK_FILES: WeekFile[] = Object.values(modules).map((m) => m.default)

export const BANK: Question[] = buildBank(WEEK_FILES)
export const BANK_BY_ID: ReadonlyMap<string, Question> = new Map(BANK.map((q) => [q.id, q]))

export interface WeekInfo {
  week: number
  title: string
  count: number
}

export function weekInfos(files: readonly WeekFile[] = WEEK_FILES, bank: readonly Question[] = BANK): WeekInfo[] {
  return WEEK_NUMBERS.map((week) => ({
    week,
    title: files.find((f) => f.week === week)?.title ?? '',
    count: bank.filter((q) => q.week === week).length,
  }))
}

export const COURSE = {
  name: 'Programming in Java',
  weeks: WEEK_NUMBERS.length,
}
