import confetti from 'canvas-confetti'

// Warm, slightly muted paper colours - festive without being neon.
const COLORS = ['#d9a441', '#2c6e72', '#c8553d', '#7fb685', '#f0d9a0', '#6f8fb8', '#9b7bb5']

/**
 * Throws coloured paper from the top and the sides. level 1 = a burst, level 2 = a longer celebration.
 * Returns a function that stops everything (call it when leaving the page). Does nothing for people who
 * have asked their device to reduce motion.
 */
export function celebrate(level: 1 | 2): () => void {
  if (typeof window === 'undefined') return () => {}
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {}

  const base = { colors: COLORS, ticks: 280, gravity: 0.9, scalar: 1.1, disableForReducedMotion: true }
  const timers: number[] = []

  confetti({ ...base, particleCount: 80, spread: 75, startVelocity: 45, origin: { x: 0.5, y: 0.3 } })

  timers.push(
    window.setTimeout(() => {
      confetti({ ...base, particleCount: 45, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.7 } })
      confetti({ ...base, particleCount: 45, angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.7 } })
    }, 260),
  )

  if (level === 2) {
    const end = Date.now() + 2800
    const id = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(id)
        return
      }
      confetti({ ...base, particleCount: 6, angle: 60, spread: 55, origin: { x: 0, y: 0.65 } })
      confetti({ ...base, particleCount: 6, angle: 120, spread: 55, origin: { x: 1, y: 0.65 } })
    }, 190)
    timers.push(id)
  }

  return () => {
    timers.forEach((t) => {
      window.clearTimeout(t)
      window.clearInterval(t)
    })
    confetti.reset()
  }
}
