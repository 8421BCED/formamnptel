import type { RawQuestion } from '../../types'
import { defineWeek } from '../define'

// Part 1 - the real Week 8 MCQ assignment (weeks/anoweeks/Week8theMCQassignmen.txt).
// Answers are NPTEL's "Accepted answer". Q9 originally showed a screenshot; it is described in words here.
const assignment: RawQuestion[] = [
  {
    q: 'Which of the following is TRUE about check boxes and radio buttons?',
    options: [
      'Check boxes allow only one selection, while radio buttons allow multiple selections.',
      'Check boxes allow multiple selections, while radio buttons allow only one selection.',
      'Both allow only one selection.',
      'Both allow multiple selections.',
    ],
    answer: 1,
  },
  {
    q: 'Which layout manager arranges components in a rectangular grid?',
    options: ['FlowLayout', 'CardLayout', 'BorderLayout', 'GridLayout'],
    answer: 3,
  },
  {
    q: 'Which method is used to set the title of a Frame in Java?',
    options: ['setTitle()', 'setName()', 'setText()', 'setLabel()'],
    answer: 0,
  },
  {
    q: 'Which method is used to request that a component be repainted in Java?',
    options: ['paint()', 'repaint()', 'update()', 'draw()'],
    answer: 1,
  },
  {
    q: 'Which AWT component is used to display a scrolling list of items?',
    options: ['Label', 'List', 'Button', 'TextField'],
    answer: 1,
  },
  {
    q: 'Which layout manager arranges components in a flow, placing them one after another?',
    options: ['FlowLayout', 'BorderLayout', 'GridLayout', 'CardLayout'],
    answer: 0,
  },
  {
    q: 'What does "AWT" stand for in Java?',
    options: ['Abstract Widget Toolkit', 'Advanced Window Toolkit', 'Abstract Window Toolkit', 'Advanced Widget Toolkit'],
    answer: 2,
  },
  {
    q: 'Which AWT component is used to create a button in a GUI?',
    options: ['Label', 'Button', 'TextField', 'Checkbox'],
    answer: 1,
  },
  {
    q: 'Which of the following correctly describes the GUI described here? A single window (with a title bar and a close button) shows the text "First Name:" and the text "Last Name:", and each of them has an empty box beside it where you can type.',
    options: [
      'It contains two Labels and one TextField.',
      'It contains one Frame, two Labels, and two TextFields.',
      'It contains two Frames, two Labels, and two TextFields.',
      'It contains one Frame, two Buttons, and two TextFields.',
    ],
    answer: 1,
  },
  {
    q: 'Which of the following is TRUE about a check box in Java?',
    options: [
      'A check box cannot be in the on or off state.',
      'Clicking a check box changes its state between on and off.',
      'A check box can be on and off at the same time.',
      'A check box cannot be grouped with other check boxes.',
    ],
    answer: 1,
  },
]

export default defineWeek({
  week: 8,
  title: 'AWT Basics',
  questions: assignment,
})
