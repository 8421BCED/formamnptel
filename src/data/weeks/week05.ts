import { defineWeek, java } from '../define'

// Source: weeks/week5.txt (answers taken from NPTEL's "Accepted answer" lines).
export default defineWeek({
  week: 5,
  title: 'Interfaces & Exception Handling',
  questions: [
    {
      q: 'Which keyword is NOT used by Java during exception handling?',
      options: ['try', 'catch', 'final', 'finally'],
      answer: 2,
    },
    {
      q: 'What is the purpose of the throws keyword in Java?',
      options: [
        'To declare exceptions that a method can throw',
        'To throw an exception immediately',
        'To catch an exception',
        'It is not a keyword in Java',
      ],
      answer: 0,
    },
    {
      q: 'Which of the following is TRUE about interfaces in Java?',
      options: [
        'Interfaces should always be defined as final',
        'Interfaces can be instantiated directly.',
        'Interfaces can extend multiple interfaces.',
        'Interfaces cannot have any method signatures',
      ],
      answer: 2,
    },
    {
      q: 'What will be the output of the following code?',
      code: java`
        interface Demo {
            void display();
        }

        class Test implements Demo {
            public void display() {
                System.out.println("Hello, NPTEL!");
            }
        }

        public class Main {
            public static void main(String[] args) {
                Test obj = new Test();
                obj.display();
            }
        }
      `,
      options: ['Hello, NPTEL!', 'Compilation Error', 'Runtime Error', 'No Output'],
      answer: 0,
    },
    {
      q: 'What will be the output of the following Java program?',
      code: java`
        interface Calculator {
            void calculate(int value);
        }

        class Square implements Calculator {
            int result;

            public void calculate(int value) {
                result = value * value;
                System.out.print("Square: " + result + " ");
            }
        }

        class Cube extends Square {
            public void calculate(int value) {
                result = value * value * value;
                super.calculate(value);
                System.out.print("Cube: " + result + " ");
            }
        }

        public class Main {
            public static void main(String[] args) {
                Calculator obj = new Cube();
                obj.calculate(3);
            }
        }
      `,
      options: [
        'Square: 9 Cube: 9',
        'Cube: 27 Square: 9',
        'Square: 9 Square: 27 Cube: 27',
        'Square: 9 Cube: 27 Square: 27',
      ],
      answer: 0,
      explain:
        'Cube sets result = 27, then super.calculate(3) overwrites result with 9 and prints "Square: 9". Back in Cube, result is now 9, so it prints "Cube: 9".',
    },
    {
      q: 'What will be the output of the following program?',
      code: java`
        class NPTEL {
            public static void main(String[] args) {
                try {
                    int a = 5;
                    int b = 0;
                    System.out.println(a / b);
                } catch (ArithmeticException e) {
                    System.out.print("Error ");
                } finally {
                    System.out.print("Complete");
                }
            }
        }
      `,
      options: ['5 Complete', 'Error Complete', 'Runtime Error', 'Compilation Error'],
      answer: 1,
    },
    {
      q: 'What will be the output of the following Java program?',
      code: java`
        interface A {
            int x = 10;
            void display();
        }

        class B implements A {
            public void display() {
                System.out.println("Value of x: " + x);
            }
        }

        public class Main {
            public static void main(String[] args) {
                B obj = new B();
                obj.display();
            }
        }
      `,
      options: ['Value of x: 10', 'Value of x: 0', 'Compilation Error', 'Runtime Error'],
      answer: 0,
      explain: 'Fields declared in an interface are implicitly public static final constants.',
    },
    {
      q: 'Which keyword is used by Java during exception handling?',
      options: ['final', 'finally', 'caught', 'finished'],
      answer: 1,
    },
    {
      q: 'A method that potentially generates a checked exception must include this keyword in its method signature:',
      options: ['throw', 'extend', 'throws', 'extends'],
      answer: 2,
    },
    {
      q: 'Consider the following code. What will be the output of the above code?',
      code: java`
        class Test extends Exception {}

        class Main {
            public static void main(String args[]) {
                try {
                    throw new Test();
                } catch (Test t) {
                    System.out.println("Got the Test Exception");
                } finally {
                    System.out.println("Inside finally block ");
                }
            }
        }
      `,
      options: [
        'Got the Test Exception\nInside finally block',
        'Got the Test Exception',
        'Inside finally block',
        'Compiler Error',
      ],
      answer: 0,
    },
  ],
})
