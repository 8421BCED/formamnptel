import { useMemo, useState, type Dispatch } from 'react'
import { weekInfos } from '../data/bank'
import { buildPool, createSession, suggestMinutes } from '../lib/exam'
import type { Action } from '../state'
import type { ExamMode, Question } from '../types'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  bank: readonly Question[]
  dispatch: Dispatch<Action>
  /** An unfinished exam exists; starting a new one replaces it. */
  resumable: boolean
}

const MODES: { id: ExamMode; title: string; blurb: string }[] = [
  { id: 'week', title: 'Week-wise', blurb: 'One week at a time, like a weekly assignment.' },
  { id: 'mixed', title: 'Mixed weeks', blurb: 'Pick several weeks and get a mix of them.' },
  { id: 'random', title: 'Random', blurb: 'Questions drawn from every week.' },
]

const COUNT_PRESETS = [5, 10, 20, 30, 50]

export function Setup({ bank: fullBank, dispatch, resumable }: Props) {
  const [officialOnly, setOfficialOnly] = useState(false)
  // "Confirmed" = the answer came with the question (not worked out separately, not written for this site).
  const bank = useMemo(
    () => (officialOnly ? fullBank.filter((q) => q.source === 'nptel') : fullBank),
    [officialOnly, fullBank],
  )
  const unofficialCount = useMemo(() => fullBank.filter((q) => q.source !== 'nptel').length, [fullBank])
  const infos = useMemo(() => weekInfos(undefined, bank), [bank])
  const firstAvailable = useMemo(() => weekInfos(undefined, fullBank).find((w) => w.count > 0)?.week, [fullBank])

  const [mode, setMode] = useState<ExamMode>('week')
  const [picked, setPicked] = useState<number[]>(firstAvailable === undefined ? [] : [firstAvailable])
  const [countChoice, setCountChoice] = useState<number | 'all'>('all')
  const [timerOn, setTimerOn] = useState(true)
  const [minutes, setMinutes] = useState<number | null>(null) // null = follow the suggestion
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(true)
  const [confirmReplace, setConfirmReplace] = useState(false)

  // A picked week that has no questions under the current filter is simply not part of the exam.
  const selected = useMemo(() => picked.filter((w) => (infos[w]?.count ?? 0) > 0), [picked, infos])
  const setSelected = setPicked

  const pool = useMemo(() => buildPool({ mode, weeks: selected }, bank), [mode, selected, bank])
  const poolSize = pool.length
  const count = countChoice === 'all' ? poolSize : Math.min(countChoice, poolSize)
  const minutesValue = minutes ?? suggestMinutes(count)
  const canStart = poolSize > 0

  function chooseMode(next: ExamMode) {
    setMode(next)
    if (next === 'week' && selected.length > 1) setSelected(selected.slice(0, 1))
  }

  function toggleWeek(week: number) {
    if (mode === 'week') setSelected([week])
    else setSelected((cur) => (cur.includes(week) ? cur.filter((w) => w !== week) : [...cur, week].sort((a, b) => a - b)))
  }

  function start() {
    const session = createSession(
      {
        mode,
        weeks: mode === 'random' ? [] : selected,
        count,
        timerMinutes: timerOn ? Math.max(1, Math.round(minutesValue)) : null,
        shuffleQuestions,
        shuffleOptions,
      },
      bank,
    )
    if (session) dispatch({ type: 'start', session })
  }

  const presets = COUNT_PRESETS.filter((n) => n < poolSize)
  const availableWeeks = infos.filter((w) => w.count > 0).map((w) => w.week)

  let summary: string
  if (mode === 'random') summary = 'All weeks'
  else if (selected.length === 0) summary = 'No week selected'
  else summary = selected.length === 1 ? `Week ${selected[0]}` : `Weeks ${selected.join(', ')}`

  return (
    <div className="setup">
      <div className="setup__main stack">
        <div>
          <h1>Set up your exam</h1>
          <p className="muted">Programming in Java · multiple choice · 1 mark per question</p>
        </div>

        <section aria-labelledby="mode-heading" className="card pad">
          <h2 id="mode-heading" className="section-title">
            1. Exam type
          </h2>
          <div className="modes" role="radiogroup" aria-labelledby="mode-heading">
            {MODES.map((m) => (
              <label key={m.id} className={`mode ${mode === m.id ? 'is-on' : ''}`}>
                <input type="radio" name="mode" checked={mode === m.id} onChange={() => chooseMode(m.id)} />
                <span className="mode__title">{m.title}</span>
                <span className="mode__blurb">{m.blurb}</span>
              </label>
            ))}
          </div>
        </section>

        {mode !== 'random' && (
          <section aria-labelledby="weeks-heading" className="card pad">
            <div className="between">
              <h2 id="weeks-heading" className="section-title">
                2. {mode === 'week' ? 'Choose a week' : 'Choose weeks'}
              </h2>
              {mode === 'mixed' && (
                <div className="row">
                  <button className="link" onClick={() => setSelected(availableWeeks)}>
                    Select all
                  </button>
                  <button className="link" onClick={() => setSelected([])}>
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="weeks">
              {infos.map((w) => {
                const on = selected.includes(w.week)
                const empty = w.count === 0
                return (
                  <button
                    key={w.week}
                    className={`week ${on ? 'is-on' : ''}`}
                    disabled={empty}
                    aria-pressed={on}
                    onClick={() => toggleWeek(w.week)}
                  >
                    <span className="week__name">Week {w.week}</span>
                    <span className="week__title">{empty ? 'No questions yet' : w.title}</span>
                    {!empty && <span className="week__count">{w.count} Q</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <section aria-labelledby="opts-heading" className="card pad">
          <h2 id="opts-heading" className="section-title">
            {mode === 'random' ? '2' : '3'}. Options
          </h2>

          <div className="field">
            <span className="field__label" id="count-label">
              Number of questions
            </span>
            <div className="chips" role="group" aria-labelledby="count-label">
              {presets.map((n) => (
                <button
                  key={n}
                  className={`chip ${countChoice === n ? 'is-on' : ''}`}
                  aria-pressed={countChoice === n}
                  onClick={() => setCountChoice(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className={`chip ${countChoice === 'all' ? 'is-on' : ''}`}
                aria-pressed={countChoice === 'all'}
                onClick={() => setCountChoice('all')}
                disabled={poolSize === 0}
              >
                All ({poolSize})
              </button>
              <label className="chip chip--input">
                Custom
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, poolSize)}
                  value={countChoice === 'all' ? '' : countChoice}
                  placeholder={String(count)}
                  disabled={poolSize === 0}
                  onChange={(e) => {
                    const n = Math.floor(Number(e.target.value))
                    if (Number.isFinite(n) && n >= 1) setCountChoice(Math.min(n, poolSize))
                  }}
                />
              </label>
            </div>
          </div>

          <div className="field">
            <label className="check">
              <input type="checkbox" checked={timerOn} onChange={(e) => setTimerOn(e.target.checked)} />
              <span>Time limit</span>
            </label>
            {timerOn && (
              <label className="inline">
                <input
                  type="number"
                  className="input input--short"
                  min={1}
                  max={300}
                  value={minutesValue}
                  onChange={(e) => {
                    const n = Math.floor(Number(e.target.value))
                    setMinutes(Number.isFinite(n) && n >= 1 ? Math.min(n, 300) : null)
                  }}
                  aria-label="Minutes allowed"
                />
                minutes
              </label>
            )}
          </div>

          <div className="field">
            <label className="check">
              <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} />
              <span>Shuffle question order</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={shuffleOptions} onChange={(e) => setShuffleOptions(e.target.checked)} />
              <span>Shuffle answer options</span>
            </label>
          </div>

          {unofficialCount > 0 && (
            <div className="field">
              <label className="check">
                <input type="checkbox" checked={officialOnly} onChange={(e) => setOfficialOnly(e.target.checked)} />
                <span>Only questions with a confirmed answer</span>
              </label>
              <span className="muted small">
                Leaves out {unofficialCount} question{unofficialCount === 1 ? '' : 's'} whose answer key was not
                available, so the answer was worked out separately.
              </span>
            </div>
          )}
        </section>
      </div>

      <aside className="setup__side">
        <div className="card pad summary">
          <h2 className="section-title">Your exam</h2>
          <dl className="summary__list">
            <div>
              <dt>Course</dt>
              <dd>Programming in Java</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{MODES.find((m) => m.id === mode)?.title}</dd>
            </div>
            <div>
              <dt>Covers</dt>
              <dd>{summary}</dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>
                {count} <span className="muted">of {poolSize} available</span>
              </dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{timerOn ? `${Math.round(minutesValue)} min` : 'No limit'}</dd>
            </div>
          </dl>
          <button
            className="btn btn--accent btn--block"
            disabled={!canStart}
            onClick={() => (resumable ? setConfirmReplace(true) : start())}
          >
            Start exam
          </button>
          {!canStart && <p className="hint">Pick at least one week that has questions.</p>}
          <button className="btn btn--ghost btn--block" onClick={() => dispatch({ type: 'goto', screen: 'home' })}>
            Back
          </button>
        </div>
      </aside>

      {confirmReplace && (
        <ConfirmDialog
          title="Replace your unfinished exam?"
          confirmLabel="Start new exam"
          danger
          onCancel={() => setConfirmReplace(false)}
          onConfirm={() => {
            setConfirmReplace(false)
            start()
          }}
        >
          You already have an exam in progress. Starting a new one discards it.
        </ConfirmDialog>
      )}
    </div>
  )
}
