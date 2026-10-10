import { APP_NAME, RECIPIENT_FULL } from '../config'
import { COURSE } from '../data/bank'
import type { Screen } from '../state'

interface Props {
  screen: Screen
  onHome: () => void
  /** During an exam the logo does not navigate away, so a stray click cannot abandon the paper. */
  locked: boolean
}

const CRUMBS: Record<Screen, string> = {
  home: 'Home',
  setup: 'Set up your exam',
  exam: 'Exam in progress',
  result: 'Your result',
}

export function Header({ screen, onHome, locked }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button className="brand" onClick={onHome} disabled={locked} aria-label="Go to the home page">
          <img className="brand__mark" src="/brand-mark.png" alt="" width={40} height={40} />
          <span className="brand__text">
            <strong>{APP_NAME}</strong>
            <small>for {RECIPIENT_FULL}</small>
          </span>
        </button>
        <div className="topbar__crumbs" aria-live="polite">
          <span>{COURSE.name}</span>
          <span aria-hidden="true">›</span>
          <span>{CRUMBS[screen]}</span>
        </div>
      </div>
    </header>
  )
}
