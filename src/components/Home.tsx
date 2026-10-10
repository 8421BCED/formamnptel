import { useState, type Dispatch } from 'react'
import { RECIPIENT } from '../config'
import { BANK, COURSE, weekInfos } from '../data/bank'
import { countAnswered, createSession } from '../lib/exam'
import { describeWeeks, formatDuration, formatWhen } from '../lib/format'
import { suggestPractice, welcome } from '../lib/messages'
import type { Action, AppState } from '../state'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  state: AppState
  dispatch: Dispatch<Action>
}

const pctOf = (correct: number, total: number) => Math.round((correct / Math.max(1, total)) * 100)
const pctClass = (p: number) => (p >= 70 ? 'pct--hi' : p >= 40 ? 'pct--mid' : 'pct--lo')

export function Home({ state, dispatch }: Props) {
  const { session, history } = state
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  // Chosen once when the page loads, so the wording does not change while she is looking at it.
  const [hello] = useState(() =>
    welcome(new Date(), {
      attempts: history.length,
      last: history[0] ? { correct: history[0].correct, total: history[0].total } : undefined,
    }),
  )

  const infos = weekInfos()
  const weeksWithQuestions = infos.filter((w) => w.count > 0).length
  const inProgress = session && session.submittedAt === null
  const finished = session && session.submittedAt !== null

  const percents = history.map((h) => pctOf(h.correct, h.total))
  const best = percents.length ? Math.max(...percents) : 0
  const recent = percents.slice(0, 5)
  const average = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) : 0

  const suggestion = inProgress ? null : suggestPractice(history, (w) => (infos[w]?.count ?? 0) > 0)

  function practiseWeek(week: number) {
    const next = createSession(
      { mode: 'week', weeks: [week], count: 1000, timerMinutes: null, shuffleQuestions: true, shuffleOptions: true },
      BANK,
    )
    if (next) dispatch({ type: 'start', session: next })
  }

  return (
    <div className="stack">
      <section className="hero" aria-labelledby="welcome-heading">
        <p className="eyebrow">{hello.eyebrow}</p>
        <h1 id="welcome-heading">{hello.title}</h1>
        <p className="hero__line">{hello.line}</p>
        <div className="row">
          <button className="btn btn--accent btn--lg" onClick={() => dispatch({ type: 'goto', screen: 'setup' })}>
            Start practising
          </button>
        </div>
      </section>

      {inProgress && (
        <section className="notice notice--info" aria-label="Exam in progress">
          <div>
            <strong>Your exam has been saved.</strong>
            <span>
              {describeModeWeeks(session.config.mode, session.config.weeks)} · {countAnswered(session)} of{' '}
              {session.items.length} answered
            </span>
          </div>
          <div className="row">
            <button className="btn btn--primary" onClick={() => dispatch({ type: 'goto', screen: 'exam' })}>
              Continue where you left off
            </button>
            <button className="btn btn--ghost" onClick={() => setConfirmDiscard(true)}>
              Discard
            </button>
          </div>
        </section>
      )}

      {finished && (
        <section className="notice" aria-label="Last result">
          <div>
            <strong>Your last exam is finished.</strong>
            <span>{describeModeWeeks(session.config.mode, session.config.weeks)}</span>
          </div>
          <button className="btn btn--ghost" onClick={() => dispatch({ type: 'goto', screen: 'result' })}>
            See the result
          </button>
        </section>
      )}

      <div className="home-grid">
        <section aria-labelledby="course-heading">
          <h2 id="course-heading" className="section-title">
            Your course
          </h2>
          <button className="course" onClick={() => dispatch({ type: 'goto', screen: 'setup' })}>
            <span className="course__badge" aria-hidden="true">
              {'</>'}
            </span>
            <span className="course__body">
              <span className="course__name">{COURSE.name}</span>
              <span className="course__meta">
                {BANK.length} questions · Weeks 0 to {COURSE.weeks - 1} ({weeksWithQuestions} ready) · multiple choice
              </span>
              <span className="course__meta">1 mark each, no negative marking</span>
            </span>
            <span className="course__go">Choose a week →</span>
          </button>
        </section>

        <section className="card pad" aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="section-title">
            Your progress
          </h2>
          {history.length === 0 ? (
            <p className="empty">
              Your results will appear here after your first practice test, {RECIPIENT}. There is no pressure, and you
              may stop and continue at any time.
            </p>
          ) : (
            <div className="stats">
              <div className="stat">
                <strong>{history.length}</strong>
                <span>{history.length === 1 ? 'Practice test' : 'Practice tests'}</span>
              </div>
              <div className="stat">
                <strong>{best}%</strong>
                <span>Best score</span>
              </div>
              <div className="stat">
                <strong>{average}%</strong>
                <span>Recent average</span>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="suggest">
              <strong>Suggested next: Week {suggestion.week}</strong>
              <p>
                You got {suggestion.correct} of {suggestion.total} right there recently. One focused round could make
                it feel much easier.
              </p>
              <button className="btn btn--primary" onClick={() => practiseWeek(suggestion.week)}>
                Practise Week {suggestion.week}
              </button>
            </div>
          )}
        </section>
      </div>

      {history.length > 0 && (
        <section aria-labelledby="history-heading">
          <div className="between wrap">
            <h2 id="history-heading" className="section-title">
              Recent attempts
            </h2>
            <button className="link" onClick={() => setConfirmClear(true)}>
              Clear history
            </button>
          </div>
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Exam</th>
                  <th className="num">Score</th>
                  <th className="num">Wrong</th>
                  <th className="num">Skipped</th>
                  <th className="num">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const p = pctOf(h.correct, h.total)
                  return (
                    <tr key={h.id}>
                      <td>{formatWhen(h.at)}</td>
                      <td>{describeModeWeeks(h.mode, h.weeks)}</td>
                      <td className="num">
                        <strong>
                          {h.correct}/{h.total}
                        </strong>{' '}
                        <span className={`pct ${pctClass(p)}`}>{p}%</span>
                      </td>
                      <td className="num">{h.wrong}</td>
                      <td className="num">{h.skipped}</td>
                      <td className="num">{formatDuration(h.durationSec)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Clear your practice history?"
          confirmLabel="Clear history"
          danger
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            setConfirmClear(false)
            dispatch({ type: 'clearHistory' })
          }}
        >
          This removes the list of attempts, your progress figures and your last saved result from this device.
          {inProgress ? ' The exam you are in the middle of is not affected.' : ''}
        </ConfirmDialog>
      )}

      {confirmDiscard && (
        <ConfirmDialog
          title="Discard this exam?"
          confirmLabel="Discard exam"
          danger
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={() => {
            setConfirmDiscard(false)
            dispatch({ type: 'discard' })
          }}
        >
          Your answers will be lost and nothing will be saved to your history.
        </ConfirmDialog>
      )}
    </div>
  )
}

function describeModeWeeks(mode: 'week' | 'mixed' | 'random', weeks: readonly number[]): string {
  if (mode === 'random') return 'Random (all weeks)'
  return `${mode === 'mixed' ? 'Mixed · ' : ''}${describeWeeks(weeks)}`
}
