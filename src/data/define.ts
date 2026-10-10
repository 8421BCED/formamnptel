import type { WeekFile } from '../types'

/** Type-checks a week file. */
export const defineWeek = (week: WeekFile): WeekFile => week

/**
 * Tag for code snippets. Backslashes stay exactly as typed ("\n" is a Java escape, not a newline),
 * and the leading/trailing blank lines plus common indentation are removed.
 *
 *   code: java`
 *     System.out.println("Hi\n");
 *   `
 */
export function java(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = String.raw(strings, ...values)
  const lines = raw.replace(/^\r?\n/, '').replace(/\s+$/, '').split(/\r?\n/)
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length)
  const strip = indents.length ? Math.min(...indents) : 0
  return lines.map((l) => l.slice(strip)).join('\n')
}
