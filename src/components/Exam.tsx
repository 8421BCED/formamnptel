import { useEffect, useRef, useState, type Dispatch } from 'react'
import { countAnswered } from '../lib/exam'
import { formatClock, optionLetter } from '../lib/format'
import { useNow } from '../lib/useNow'
import type { Action } from '../state'
import type { ExamSession, Question } from '../types'
import { ConfirmDialog } from './ConfirmDialog'
import { Palette } from './Palette'
import { QuestionBody } from './QuestionBody'

interface Props {
  session: ExamSession
  lookup: ReadonlyMap<string, Question>
  dispatch: Dispatch<Action>
}

export function Exam({ session, lookup, dispatch }: Props) {
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const now = useNow(session.endsAt === null ? null : 1000)
  const autoSubmitted = useRef(false)

  const index = session.current
  const item = session.items[index]
  const question = lookup.get(item.id)!
  const total = session.items.length
  const isLast = index === total - 1
  const chosenOriginal = item.id in session.answers ? session.answers[item.id] : null
  const chosenDisplay = chosenOriginal === null ? -1 : item.order.indexOf(chosenOriginal)
  const isMarked = session.marked.includes(item.id)

  const remaining = session.endsAt === null ? null : Math.max(0, Math.ceil((session.endsAt - now) / 1000))

  // When the clock hits zero the paper is handed in automatically.
  useEffect(() => {
    if (session.endsAt !== null && now >= session.endsAt && !autoSubmitted.current) {
      autoSubmitted.current = true
      dispatch({ type: 'submit', at: session.endsAt })
    }
  }, [now, session.endsAt, dispatch])

  // Keyboard: a-d choose an option, arrows move between questions, m toggles "mark for review".
  useEffect(() => {
    if (confirmSubmit) return
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return
      const key = e.key.toLowerCase()
      const letter = 'abcdefgh'.indexOf(key)
      if (key.length === 1 && letter >= 0 && letter < item.order.length) {
        dispatch({ type: 'answer', id: item.id, value: item.order[letter] })
      } else if (key === 'arrowright') {
        dispatch({ type: 'jump', index: index + 1 })
      } else if (key === 'arrowleft') {
        dispatch({ type: 'jump', index: index - 1 })
      } else if (key === 'm') {
        dispatch({ type: 'mark', id: item.id })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmSubmit, dispatch, index, item])

  const answered = countAnswered(session)
  const markedCount = session.marked.length
  const timerClass =
    remaining === null ? '' : remaining <= 60 ? 'timer--danger' : remaining <= 300 ? 'timer--warn' : ''

  return (
    <div className="exam">
      <div className="examhead card">
        <div>
          <div className="examhead__title">Programming in Java · Practice exam</div>
          <div className="muted">
            {answered} of {total} answered
          </div>
        </div>
        <div className="row">
          {remaining !== null && (
            <div className={`timer ${timerClass}`} role="timer" aria-label="Time remaining">
              <span className="timer__label">Time left</span>
              <span className="timer__value">{formatClock(remaining)}</span>
            </div>
          )}
          <button className="btn btn--primary" onClick={() => setConfirmSubmit(true)}>
            Submit
          </button>
        </div>
        <div
          className="meter"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
        >
          <span style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      <div className="exam__body">
        <section className="card qcard" aria-labelledby="qhead">
          <div className="qcard__head">
            <h1 id="qhead" className="qcard__num">
              Question {index + 1} <span className="muted">of {total}</span>
            </h1>
            <span className="pill">1 mark</span>
          </div>

          <QuestionBody question={question}>
            <div className="options" role="radiogroup" aria-label="Answer options">
              {item.order.map((originalIdx, displayIdx) => {
                const selected = displayIdx === chosenDisplay
                return (
                  <label key={originalIdx} className={`option ${selected ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name={`q-${item.id}`}
                      checked={selected}
                      onChange={() => dispatch({ type: 'answer', id: item.id, value: originalIdx })}
                    />
                    <span className="option__letter">{optionLetter(displayIdx)}.</span>
                    <span className="option__text">{question.options[originalIdx]}</span>
                  </label>
                )
              })}
            </div>
          </QuestionBody>

          <div className="qcard__actions">
            <button className="btn btn--ghost" disabled={index === 0} onClick={() => dispatch({ type: 'jump', index: index - 1 })}>
              ← Previous
            </button>
            <button
              className={`btn btn--ghost ${isMarked ? 'is-marked' : ''}`}
              aria-pressed={isMarked}
              onClick={() => dispatch({ type: 'mark', id: item.id })}
            >
              {isMarked ? '★ Marked for review' : '☆ Mark for review'}
            </button>
            <button
              className="btn btn--ghost"
              disabled={chosenOriginal === null}
              onClick={() => dispatch({ type: 'answer', id: item.id, value: null })}
            >
              Clear response
            </button>
            {isLast ? (
              <button className="btn btn--accent push" onClick={() => setConfirmSubmit(true)}>
                Review &amp; submit
              </button>
            ) : (
              <button className="btn btn--accent push" onClick={() => dispatch({ type: 'jump', index: index + 1 })}>
                Save &amp; next →
              </button>
            )}
          </div>
          <p className="kbd-hint">
            Shortcuts: <kbd>a</kbd>–<kbd>d</kbd> pick an option · <kbd>←</kbd> <kbd>→</kbd> move · <kbd>m</kbd> mark
          </p>
        </section>

        <Palette session={session} onJump={(i) => dispatch({ type: 'jump', index: i })} />
      </div>

      {confirmSubmit && (
        <ConfirmDialog
          title="Submit your exam?"
          confirmLabel="Submit exam"
          cancelLabel="Keep working"
          onCancel={() => setConfirmSubmit(false)}
          onConfirm={() => {
            setConfirmSubmit(false)
            dispatch({ type: 'submit', at: Date.now() })
          }}
        >
          <ul className="tally">
            <li>
              <strong>{answered}</strong> answered
            </li>
            <li className={total - answered > 0 ? 'tally--warn' : ''}>
              <strong>{total - answered}</strong> not answered
            </li>
            <li>
              <strong>{markedCount}</strong> marked for review
            </li>
          </ul>
          {total - answered > 0 && <p>Unanswered questions score 0. You cannot change answers after submitting.</p>}
        </ConfirmDialog>
      )}
    </div>
  )
}
