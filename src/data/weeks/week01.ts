import type { RawQuestion } from '../../types'
import { defineWeek, java } from '../define'

// Part 1 - the real "Week 1 : Assignment 1" (weeks/anoweeks/theweek1.txt). Answers are NPTEL's "Accepted answer".
const assignment: RawQuestion[] = [
  {
    q: 'Consider the following program. What is the output of the above code?',
    code: java`
      class NPTEL {
          public static void main(String[] args) {
              System.out.println("Hello, World!");
          }
      }
    `,
    options: ['Hello, World!', 'HelloWorld!', 'Compilation Error', 'Runtime Error'],
    answer: 0,
  },
  {
    q: "A Java file with extension '.class' contains:",
    options: [
      'Java source code',
      'HTML tags',
      'Java Byte code',
      'A program file written in Java programming language',
    ],
    answer: 2,
  },
  {
    q: 'Which of the following is NOT an object-oriented programming paradigm?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Dynamic memory allocation'],
    answer: 3,
  },
  {
    q: 'What is the correct sequence of steps to execute a Java program?',
    options: ['Run → Edit → Compile', 'Edit → Run → Compile', 'Compile → Edit → Run', 'Edit → Compile → Run'],
    answer: 3,
  },
  {
    q: 'Which program is used to compile Java source code into bytecode?',
    options: ['javap', 'javac', 'java', 'javad'],
    answer: 1,
  },
  {
    q: 'In Java, what is the role of the public static void main(String[] args) method?',
    options: ['Initialization method', 'Execution entry point', 'Constructor', 'Destructor'],
    answer: 1,
  },
  {
    q: 'Which of the following is not a feature of Java?',
    options: [
      'Platform Independence',
      'Object-Oriented Programming',
      'Supports Explicit Pointers',
      'Supports Polymorphism',
    ],
    answer: 2,
  },
  {
    q: 'What is the primary purpose of the Java Virtual Machine (JVM) in the Java programming language?',
    options: ['Graphical User Interface', 'Platform independence', 'Code Debugging', 'Game Engine'],
    answer: 1,
  },
  {
    q: 'Consider the following program. What is the output of the above code?',
    code: java`
      public class Question {
          public static void main(String[] args) {
              int x = 5;
              x *= (2 + 8);
              System.out.println(x);
          }
      }
    `,
    options: ['50', '10', 'Compiler error', '5'],
    answer: 0,
    explain: 'x *= (2 + 8) means x = x * (2 + 8) = 5 * 10 = 50.',
  },
  {
    q: 'Which of the following is true regarding how Java handles code execution?',
    options: [
      'Java uses only interpreter.',
      'Java uses only compiler.',
      'Java uses both interpreter and compiler.',
      'None of the above.',
    ],
    answer: 2,
    fixedOptions: true,
    explain: 'javac compiles source to bytecode, and the JVM then interprets (and JIT-compiles) that bytecode.',
  },
]

export default defineWeek({
  week: 1,
  title: 'Introduction to Java & OOP',
  questions: assignment,
})
