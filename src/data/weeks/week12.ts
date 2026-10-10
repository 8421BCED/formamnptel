import { defineWeek } from '../define'

// Sources:
//  - Q1-Q10   weeks/anoweek.txt: a 10-question mixed quiz with NO answer key (marked `inferred`). It ends with the
//             same footer as the Week 12 programming-assignment pages, so it was placed in Week 12.
//             Confirmed against screenshots of "Week 12 : Assignment 12" (same 10 questions and options). The page showed
//             no "Accepted answer" lines yet (not graded; due 2026-10-15). After grading, screenshot it again and
//             switch Q1-Q9 from `inferred` to official.
//  The JDBC set that used to be here (weeks/week12.txt) is the Week 11 assignment - see week11.ts.
export default defineWeek({
  week: 12,
  title: 'Revision',
  questions: [
    // ---- Mixed quiz (anoweek.txt, answers inferred) --------------------------------------------
    {
      q: 'Which method returns the number of characters in a Java String?',
      options: ['size()', 'length()', 'count()', 'getSize()'],
      answer: 1,
      source: 'inferred',
    },
    {
      q: 'Which method is used to get a character at a specified position in a String?',
      options: ['charAt()', 'getChar()', 'characterAt()', 'getAt()'],
      answer: 0,
      source: 'inferred',
    },
    {
      q: 'Which keyword is used to create a subclass in Java?',
      options: ['implements', 'inherits', 'extends', 'super'],
      answer: 2,
      source: 'inferred',
    },
    {
      q: 'Which block is executed whether an exception occurs or not?',
      options: ['try', 'catch', 'throw', 'finally'],
      answer: 3,
      source: 'inferred',
    },
    {
      q: 'Which keyword is used to explicitly throw an exception in Java?',
      options: ['throws', 'throw', 'exception', 'catch'],
      answer: 1,
      source: 'inferred',
    },
    {
      q: 'Which keyword is used to indicate that a method may throw an exception?',
      options: ['throw', 'throws', 'try', 'finally'],
      answer: 1,
      source: 'inferred',
    },
    {
      q: 'Which syntax is used to declare an array variable in Java?',
      options: ['array', 'newarray', '[]', 'arrayof'],
      answer: 2,
      source: 'inferred',
      explain: 'For example: int[] numbers;  (square brackets after the type).',
    },
    {
      q: 'Which layout manager arranges components in five regions?',
      options: ['FlowLayout', 'BorderLayout', 'GridLayout', 'BoxLayout'],
      answer: 1,
      source: 'inferred',
      explain: 'BorderLayout has NORTH, SOUTH, EAST, WEST and CENTER regions.',
    },
    {
      q: 'Which method is used to register an ActionListener with a JButton?',
      options: ['addActionListener()', 'addButtonListener()', 'setAction()', 'registerAction()'],
      answer: 0,
      source: 'inferred',
    },
    {
      q: 'Which method of NetworkInterface is used to check whether a network interface is up?',
      options: ['isActive()', 'isUp()', 'isRunning()', 'isConnected()'],
      answer: 1,
      source: 'nptel', // same question as Week 10 Q10, where NPTEL's accepted answer is isUp()
    },
  ],
})
