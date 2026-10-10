import type { RawQuestion } from '../../types'
import { java } from '../define'

// PARKED - this file is NOT loaded by the app (only src/data/weeks/*.ts is). The questions are kept here so
// nothing is lost. To bring them back, import this default export into the week file and spread it into
// `questions`, e.g.  questions: [...assignment, ...extra]
// Source: written from the Week 12 programming assignments (anotherweek.txt, week.txt, week13.txt). All programs were compiled and run.
const questions: RawQuestion[] = [
    // ---- Written from the Week 12 programming assignments --------------------------------------
    {
      // W12_P1 - parameterized constructors
      q: 'What is the output of the following program?',
      code: java`
        public class Stu {
            static class Student {
                String name;
                int roll;

                Student(String name, int roll) {
                    this.name = name;
                    this.roll = roll;
                }
            }

            public static void main(String[] args) {
                Student s = new Student("Asha", 7);
                System.out.println(s.name + " " + s.roll);
            }
        }
      `,
      options: ['Asha 7', 'null 0', '7 Asha', 'Compilation error: a constructor needs a return type'],
      answer: 0,
      source: 'derived',
    },
    {
      q: 'In a parameterized constructor Student(String name, int roll), what does the statement this.name = name; do?',
      options: [
        'Copies the constructor parameter name into the instance variable name of the object being created.',
        'Copies the instance variable name into the constructor parameter.',
        'Declares a new String variable called this.name.',
        'Compares the parameter name with the instance variable name.',
      ],
      answer: 0,
      source: 'derived',
    },
    {
      // W12_P3 - nested if-else
      q: 'What is the output of the following code?',
      code: java`
        int num = -4;
        if (num > 0) {
            System.out.println("Positive Number");
        } else {
            if (num < 0) {
                System.out.println("Negative Number");
            } else {
                System.out.println("Zero");
            }
        }
      `,
      options: ['Positive Number', 'Negative Number', 'Zero', 'Positive Number\nNegative Number'],
      answer: 1,
      source: 'derived',
    },
    {
      // W12_P4 - loop sum
      q: 'What is the output of the following code?',
      code: java`
        int n = 5;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println("Sum is: " + sum);
      `,
      options: ['Sum is: 10', 'Sum is: 15', 'Sum is: 21', 'Sum is: 5'],
      answer: 1,
      source: 'derived',
    },
    {
      q: 'What is the output of the following code?',
      code: java`
        int n = 5;
        int sum = 0;
        for (int i = 1; i < n; i++) {
            sum += i;
        }
        System.out.println("Sum is: " + sum);
      `,
      options: ['Sum is: 10', 'Sum is: 15', 'Sum is: 5', 'Sum is: 6'],
      answer: 0,
      source: 'derived',
      explain: 'With i < n the loop stops at i = 4, so only 1 + 2 + 3 + 4 = 10 is added.',
    },
    {
      // W12_P5 - arrays, loops and conditions
      q: 'What is the output of the following code?',
      code: java`
        int[] arr = {3, -2, 7, -8, 10};
        int sum = 0;
        int negativeCount = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > 0) {
                sum += arr[i];
            } else if (arr[i] < 0) {
                negativeCount++;
            }
        }
        System.out.println("Sum of positive numbers: " + sum);
        System.out.println("Count of negative numbers: " + negativeCount);
      `,
      options: [
        'Sum of positive numbers: 20\nCount of negative numbers: 2',
        'Sum of positive numbers: 10\nCount of negative numbers: 2',
        'Sum of positive numbers: 20\nCount of negative numbers: 3',
        'Sum of positive numbers: 18\nCount of negative numbers: 2',
      ],
      answer: 0,
      source: 'derived',
      explain: 'Positives: 3 + 7 + 10 = 20. Negatives: -2 and -8, so the count is 2.',
    },
]

export default questions.map((q): RawQuestion => ({ ...q, source: 'derived' }))
