import { useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch } from 'react'
import { celebrate } from '../lib/celebrate'
import { gradeSession, isCorrectChoice, sessionFromQuestions } from '../lib/exam'
import { describeWeeks, formatDuration, optionLetter } from '../lib/format'
import { previousAttempt, resultMessage } from '../lib/messages'
import type { Action } from '../state'
import type { ExamSession, GradedItem, HistoryEntry, Question, QuestionStatus } from '../types'
import { QuestionBody } from './QuestionBody'

interface Props {
  session: ExamSession
  lookup: ReadonlyMap<string, Question>
  history: HistoryEntry[]
  dispatch: Dispatch<Action>
}

type Filter = 'all' | QuestionStatus

const STATUS_TITLE: Record<QuestionStatus, string> = {
  correct: 'Correct · 1 mark',
  wrong: 'Not quite · 0 marks',
  skipped: 'Skipped · 0 marks',
}

export function Result({ session, lookup, history, dispatch }: Props) {
  const graded = useMemo(() => gradeSession(session, lookup), [session, lookup])
  const [filter, setFilter] = useState<Filter>('all')

  const message = useMemo(() => {
    const previous = previousAttempt(history, {
      id: session.id,
      mode: session.config.mode,
      weeks: graded.byWeek.map((w) => w.week),
    })
    const timeLeftSec =
      session.endsAt !== null && session.submittedAt !== null
        ? Math.max(0, Math.round((session.endsAt - session.submittedAt) / 1000))
        : null
    return resultMessage(graded, { seed: session.id, previous, timeLeftSec })
  }, [graded, history, session])

  // Coloured paper for a good result - once per exam, not every time she reopens the page.
  const stopConfetti = useRef<(() => void) | null>(null)
  useEffect(() => {
    if (message.confetti === 0) return
    const key = `celebrated:${session.id}`
    let already = false
    try {
      already = window.sessionStorage.getItem(key) === '1'
    } catch {
      /* storage unavailable: just celebrate */
    }
    if (!already) stopConfetti.current = celebrate(message.confetti)
    // Remember it only after the show has had time to play, so a quick re-render never swallows it.
    const mark = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(key, '1')
      } catch {
        /* ignore */
      }
    }, 3000)
    return () => {
      window.clearTimeout(mark)
      stopConfetti.current?.()
      stopConfetti.current = null
    }
  }, [message.confetti, session.id])

  const visible = graded.items.filter((i) => filter === 'all' || i.status === filter)
  const missed = graded.items.filter((i) => i.status !== 'correct')
  const timeLimit = session.config.timerMinutes
  const ranOut = session.endsAt !== null && session.submittedAt !== null && session.submittedAt >= session.endsAt

  function retryMissed() {
    const picked = missed.map((i) => i.question)
    const weeks = [...new Set(picked.map((q) => q.week))].sort((a, b) => a - b)
    const next = sessionFromQuestions(picked, {
      ...session.config,
      mode: 'mixed',
      weeks,
      count: picked.length,
    })
    dispatch({ type: 'start', session: next })
  }

  function celebrateAgain() {
    stopConfetti.current?.()
    stopConfetti.current = celebrate(message.confetti === 2 ? 2 : 1)
  }

  const counts: Record<Filter, number> = {
    all: graded.total,
    wrong: graded.wrong,
    skipped: graded.skipped,
    correct: graded.correct,
  }

  const showWeeks = graded.byWeek.length > 1
  const showInsights = message.insights.length > 0

  return (
    <div className="stack">
      <section className={`verdict verdict--${message.tone}`} aria-labelledby="score-heading">
        <div
          className="ring"
          style={{ '--p': graded.percent } as CSSProperties}
          role="img"
          aria-label={`${graded.percent} percent`}
        >
          <span>{graded.percent}%</span>
        </div>
        <div className="verdict__main">
          <p className="eyebrow verdict__meta">
            {session.config.mode === 'random' ? 'Random (all weeks)' : describeWeeks(graded.byWeek.map((w) => w.week))} ·{' '}
            {formatDuration(graded.durationSec)}
            {timeLimit ? ` of ${timeLimit} min` : ''}
            {ranOut ? ' · time ran out, so the exam was handed in for you' : ''}
          </p>
          <h1 id="score-heading">{message.headline}</h1>
          <p className="verdict__line">{message.line}</p>
          <p className="verdict__score">
            You scored{' '}
            <strong>
              {graded.correct} out of {graded.total}
            </strong>
          </p>
          <div className="row">
            {missed.length > 0 && (
              <button className="btn btn--accent" onClick={retryMissed}>
                Retry the {missed.length} you missed
              </button>
            )}
            <button className="btn btn--glass" onClick={() => dispatch({ type: 'goto', screen: 'setup' })}>
              New exam
            </button>
            <button className="btn btn--glass" onClick={() => dispatch({ type: 'goto', screen: 'home' })}>
              Home
            </button>
            {message.confetti > 0 && (
              <button className="btn btn--glass" onClick={celebrateAgain}>
                Celebrate again
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="tiles" aria-label="Summary">
        <div className="tile tile--ok">
          <strong>{graded.correct}</strong>
          <span>Correct</span>
        </div>
        <div className="tile tile--bad">
          <strong>{graded.wrong}</strong>
          <span>Wrong</span>
        </div>
        <div className="tile tile--skip">
          <strong>{graded.skipped}</strong>
          <span>Not attempted</span>
        </div>
        <div className="tile">
          <strong>{formatDuration(graded.durationSec)}</strong>
          <span>Time taken</span>
        </div>
      </section>

      {(showInsights || showWeeks) && (
        <div className={showInsights && showWeeks ? 'two-col' : undefined}>
          {showInsights && (
            <section className="card pad" aria-labelledby="insights-heading">
              <h2 id="insights-heading" className="section-title">
                What stood out
              </h2>
              <ul className="insights">
                {message.insights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </section>
          )}

          {showWeeks && (
            <section className="card pad" aria-labelledby="byweek-heading">
              <h2 id="byweek-heading" className="section-title">
                Score by week
              </h2>
              <ul className="bars">
                {graded.byWeek.map((w) => (
                  <li key={w.week}>
                    <span className="bars__label">Week {w.week}</span>
                    <span className="bars__track" aria-hidden="true">
                      <span className="bars__fill" style={{ width: `${(w.correct / w.total) * 100}%` }} />
                    </span>
                    <span className="bars__value">
                      {w.correct}/{w.total}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section aria-labelledby="review-heading">
        <div className="between wrap">
          <h2 id="review-heading" className="section-title">
            Review your answers
          </h2>
          <div className="chips" role="group" aria-label="Filter questions">
            {(['all', 'wrong', 'skipped', 'correct'] as const).map((f) => (
              <button
                key={f}
                className={`chip ${filter === f ? 'is-on' : ''}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'wrong' ? 'Wrong' : f === 'skipped' ? 'Not attempted' : 'Correct'} ({counts[f]})
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && <p className="card pad muted">Nothing to show for this filter.</p>}

        <div className="stack">
          {visible.map((item) => (
            <ReviewCard key={item.question.id} item={item} number={graded.items.indexOf(item) + 1} />
          ))}
        </div>
      </section>
    </div>
  )
}

function ReviewCard({ item, number }: { item: GradedItem; number: number }) {
  const { question, order, chosen, status } = item
  const correctLetter = optionLetter(order.indexOf(question.answer))
  const alsoLetters = (question.alsoCorrect ?? []).map((i) => optionLetter(order.indexOf(i)))

  return (
    <article className={`card review review--${status}`}>
      <div className="review__head">
        <h3>
          Question {number} <span className="muted">· Week {question.week}</span>
        </h3>
        <span className={`badge badge--${status}`}>
          {status === 'correct' ? 'Correct' : status === 'wrong' ? 'Wrong' : 'Not attempted'}
        </span>
      </div>

      <QuestionBody question={question}>
        <ul className="options options--review">
          {order.map((originalIdx, displayIdx) => {
            const isCorrect = isCorrectChoice(question, originalIdx)
            const isChosen = originalIdx === chosen
            const cls = isCorrect ? 'is-correct' : isChosen ? 'is-wrong' : ''
            return (
              <li key={originalIdx} className={`option ${cls}`}>
                <span className="option__letter">{optionLetter(displayIdx)}.</span>
                <span className="option__text">{question.options[originalIdx]}</span>
                <span className="option__tag">
                  {isCorrect && isChosen && '✓ Your answer'}
                  {isCorrect && !isChosen && '✓ Correct answer'}
                  {!isCorrect && isChosen && '✗ Your answer'}
                </span>
              </li>
            )
          })}
        </ul>
      </QuestionBody>

      <div className={`feedback feedback--${status}`}>
        <p className="feedback__title">{STATUS_TITLE[status]}</p>
        <p>
          Correct answer: <strong>{correctLetter}</strong>
          {alsoLetters.length > 0 &&
            ` (${alsoLetters.join(', ')} ${alsoLetters.length === 1 ? 'is' : 'are'} also correct)`}
        </p>
      </div>

      {question.explain && (
        <p className="explain">
          <strong>Why: </strong>
          {question.explain}
        </p>
      )}

      {question.source === 'inferred' && (
        <p className="srcnote">
          No answer key was available for this question, so the answer shown was worked out separately. Double-check it
          against your notes.
        </p>
      )}
      {question.source === 'derived' && (
        <p className="srcnote">This question was written from a programming assignment.</p>
      )}
    </article>
  )
}
