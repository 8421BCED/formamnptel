import { defineWeek, java } from '../define'

// Source: weeks/anoweeks/week0.txt plus screenshots of the "Week 0 : Assignment 0" page - all 20 questions.
// The page shows no answer key, so every answer here is `inferred` (worked out by hand and re-checked).
//
// Three questions are flawed on NPTEL's own page, so they carry a note and a judgement call:
//   Q8   the matrix's row 2 is missing in the original question (proved: det is a multiple of 8, only 72 fits).
//   Q11  "sum of the first ___ even numbers" - the count is missing in the original (30 assumed; 20 also fits).
//   Q18  both "i % 2 != 0" and "i % 2 == 1" are correct for i >= 1, so both are accepted (`alsoCorrect`).
export default defineWeek({
  week: 0,
  title: 'Prerequisites: Logic & Pseudocode',
  source: 'inferred',
  questions: [
    {
      q: 'If the sequence of numbers 2, 6, 12, 20, 30 ... continues in the same pattern, what will be the 7th term in the sequence?',
      options: ['42', '48', '56', '72'],
      answer: 2,
      explain: 'The terms are n x (n + 1): 1x2, 2x3, 3x4, 4x5, 5x6, 6x7 = 42, and the 7th is 7x8 = 56.',
    },
    {
      q: 'What is the following set of statements equivalent to?',
      code: java`
        if (x == 1)
            x = 0;
        else if (x == 0)
            x = 1;
      `,
      options: ['x = 1 - x', 'x = x - 1', 'x = 1 + x', 'x = 1 % x'],
      answer: 0,
      explain: '1 becomes 0 and 0 becomes 1, which is 1 - x. (x - 1 would turn 0 into -1.)',
    },
    {
      q: 'What is the modulus of the complex number z = 3 + 4i? (Hint: The modulus of a complex number z = a + bi is the square root of (a² + b²).)',
      options: ['3', '5', '4', '7'],
      answer: 1,
      explain: '√(3² + 4²) = √25 = 5.',
    },
    {
      q: 'Calculate the dot product of two vectors u = (2, 3) and v = (4, -1). (Hint: The dot product is u1*v1 + u2*v2.)',
      options: ['5', '7', '10', '11'],
      answer: 0,
      explain: '2*4 + 3*(-1) = 8 - 3 = 5.',
    },
    {
      q: 'If the sequence of numbers 1, 8, 27, 64, 125 ... continues in the same pattern, what will be the 6th term?',
      options: ['216', '343', '512', '729'],
      answer: 0,
      explain: 'These are the cubes 1³, 2³, 3³, 4³, 5³, so the 6th term is 6³ = 216.',
    },
    {
      q: 'Consider a logic flow to find the maximum of three numbers (x, y, z). Step 1: If x > y, then check if x > z. If true, max = x; otherwise max = z. Step 2: Else (meaning y >= x), check a missing condition. What is the missing condition to determine if y is the maximum?',
      options: ['if x > z', 'if y > z', 'if y < z', 'if x < z'],
      answer: 1,
      explain: 'In this branch x is already no bigger than y, so y is the maximum exactly when y > z (otherwise z is).',
    },
    {
      q: 'A number is considered a "special number" if the sum of the factorial of its digits equals the number itself. Which of the following is a "special number"?',
      options: ['123', '145', '153', '170'],
      answer: 1,
      explain: '1! + 4! + 5! = 1 + 24 + 120 = 145.',
    },
    {
      q: 'Given a 3x3 matrix A where row 1 is [2, -1, 3], row 2 is [not shown - missing in the original NPTEL question too], and row 3 is [-2, -3, 1], what is the determinant of A?',
      options: ['-54', '49', '54', '72'],
      answer: 3,
      explain:
        'Row 2 is missing on NPTEL\'s page, but it can still be answered. For any row 2 = [a, b, c] the determinant works out to 8 x (-a + b + c). If the entries are whole numbers it must be a multiple of 8, and only 72 (= 8 x 9) is.',
    },
    {
      q: 'Predict the output of the following pseudocode logic if n = 5:',
      code: java`
        Set result = 1
        Loop i from 1 to n:
            result = result * (i - 1)
        End Loop
        Print result
      `,
      options: ['0', '1', '115', '120'],
      answer: 0,
      explain: 'On the first pass i = 1, so result is multiplied by (1 - 1) = 0 and stays 0 from then on.',
    },
    {
      q: "In a loop designed to calculate the sum of all even numbers in a range, which condition correctly identifies an even number 'i'?",
      options: ['i % 2 == 1', 'i % 2 == -1', 'i % 2 != 0', 'i % 2 == 0'],
      answer: 3,
    },
    {
      q: 'What is the sum of the first even numbers? (The count is missing in the original NPTEL question; read it as the first 5.)',
      options: ['15', '30', '9', '20'],
      answer: 1,
      explain:
        'A sum of even numbers is always even, so 15 and 9 are out. The first five even numbers give 2 + 4 + 6 + 8 + 10 = 30 (the first four would give 20). NPTEL left out how many numbers, so 30 is the most likely intended answer.',
    },
    {
      q: 'If x = 5, what will x be after executing:',
      code: java`
        x = x * 2;
        x = x - 3;
      `,
      options: ['7', '10', '5', '13'],
      answer: 0,
      explain: '5 * 2 = 10, then 10 - 3 = 7.',
    },
    {
      q: 'Which condition checks if a number x is odd?',
      options: ['x / 2 == 1', 'x / 2 == 0', 'x % 2 == 0', 'x % 2 != 0'],
      answer: 3,
    },
    {
      q: 'What is the modulus of the complex number z = 8 + 6i?',
      options: ['10', '√64', '√102', '√36'],
      answer: 0,
      explain: '√(8² + 6²) = √100 = 10.',
    },
    {
      q: 'If the sequence is 2, 4, 8, 16, what is the next number?',
      options: ['18', '24', '32', '36'],
      answer: 2,
      explain: 'Each term is double the previous one.',
    },
    {
      q: 'Given 3 numbers x, y and z. In order to find the minimum using if-then-else, what should be placed in the blank (#MISSING)?',
      code: java`
        if ________ then        #MISSING
            if x < z then
                min = x
            else
                min = z
        else
            if y < z then
                min = y
            else
                min = z
      `,
      options: ['if y > z then', 'if y < z then', 'if x > z then', 'if x < y then'],
      answer: 3,
      explain:
        'The outer test decides which pair to compare. If x < y, the minimum is either x or z (compare x with z). Otherwise it is either y or z (compare y with z).',
    },
    {
      q: 'What is the output of the following code for n = 3?',
      code: java`
        result = 0
        for i = 1 to n do
            result = result + i
        print(result)
      `,
      options: ['3', '6', '9', '1'],
      answer: 1,
      explain: '1 + 2 + 3 = 6.',
    },
    {
      q: 'Consider the following pseudo-code for calculating the sum of all odd numbers in a range. What condition should be placed in the blank (#MISSING)?',
      code: java`
        sum = 0
        for i = 1 to n do
            if ________        #MISSING
                sum = sum + i
      `,
      options: ['i % 2 == 0', 'i % 2 != 0', 'i % 2 == 1', 'i % 2 == -1'],
      answer: 1,
      alsoCorrect: [2],
      explain:
        'i starts at 1, so it is never negative: an odd i leaves remainder 1, which means both i % 2 != 0 and i % 2 == 1 work. (i % 2 != 0 is the safer general test, because in Java a negative odd number gives -1.)',
    },
    {
      q: 'What will be the output of the following pseudo-code if n = 4?',
      code: java`
        result = 1
        for i = 1 to n do
            result = result * (i - 1 + 1)
        print(result)
      `,
      options: ['4', '8', '24', '16'],
      answer: 2,
      explain: '(i - 1 + 1) is just i, so this computes 1 x 2 x 3 x 4 = 24.',
    },
    {
      q: 'A function foo(int) is defined as follows. What will be the output of the program if we call foo(3)? Select your option from the following.',
      code: java`
        int foo(int n) {
            int result = 1;
            for (int i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
      `,
      options: [
        'The program will result in a compilation error.',
        '6',
        '9',
        'The program will result in a runtime error due to infinite loop.',
      ],
      answer: 1,
      explain: 'The loop multiplies 2 and 3 into result (starting from 1): 1 x 2 x 3 = 6 (this is 3 factorial).',
    },
  ],
})
