import type { ReactNode } from 'react'
import type { Question } from '../types'

interface Props {
  question: Question
  children?: ReactNode
}

/** The question text and (optional) code block - shared by the exam and the result review. */
export function QuestionBody({ question, children }: Props) {
  return (
    <>
      <p className="stem">{question.q}</p>
      {question.code && (
        <pre className="code" tabIndex={0} aria-label="Code for this question">
          <code>{question.code}</code>
        </pre>
      )}
      {children}
    </>
  )
}
