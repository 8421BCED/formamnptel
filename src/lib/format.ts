export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m === 0) return `${sec}s`
  return sec === 0 ? `${m} min` : `${m} min ${sec}s`
}

export const optionLetter = (displayIndex: number): string => String.fromCharCode(97 + displayIndex)

export function formatWhen(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function describeWeeks(weeks: readonly number[]): string {
  if (weeks.length === 0) return '-'
  const sorted = [...weeks].sort((a, b) => a - b)
  if (sorted.length === 1) return `Week ${sorted[0]}`
  return `Weeks ${sorted.join(', ')}`
}
