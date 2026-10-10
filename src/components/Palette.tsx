import { stateOf, type QuestionState } from '../lib/exam'
import type { ExamSession } from '../types'

interface Props {
  session: ExamSession
  onJump: (index: number) => void
}

const LABEL: Record<QuestionState, string> = {
  current: 'current question',
  answered: 'answered',
  marked: 'marked for review, not answered',
  'marked-answered': 'marked for review, answered',
  unanswered: 'not answered',
}

/** The numbered question grid: jump to any question and see what is answered or marked. */
export function Palette({ session, onJump }: Props) {
  return (
    <section className="card palette" aria-label="Question palette">
      <h2 className="palette__title">Question palette</h2>
      <div className="palette__grid">
        {session.items.map((item, i) => {
          const state = stateOf(session, i)
          return (
            <button
              key={item.id}
              className={`pbtn pbtn--${state}`}
              onClick={() => onJump(i)}
              aria-label={`Question ${i + 1}, ${LABEL[state]}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <ul className="legend">
        <li>
          <span className="pbtn pbtn--answered" aria-hidden="true" /> Answered
        </li>
        <li>
          <span className="pbtn pbtn--unanswered" aria-hidden="true" /> Not answered
        </li>
        <li>
          <span className="pbtn pbtn--marked" aria-hidden="true" /> Marked for review
        </li>
        <li>
          <span className="pbtn pbtn--marked-answered" aria-hidden="true" /> Answered &amp; marked
        </li>
      </ul>
    </section>
  )
}
