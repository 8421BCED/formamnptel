import { defineWeek, java } from '../define'

// Source: weeks/week4.txt (answers taken from NPTEL's "Accepted answer" lines).
// Q4 had no answer line in the file - its answer is marked `inferred`.
export default defineWeek({
  week: 4,
  title: 'Access Control, Packages & Operators',
  questions: [
    {
      q: 'What is the process by which we can control what parts of a program can access the members of a class?',
      options: ['Polymorphism', 'Augmentation', 'Encapsulation', 'Recursion'],
      answer: 2,
    },
    {
      q: 'Consider the program given below. What will be the output if the program is executed?',
      code: java`
        public class Main {
            public static void main(String args[]) {
                System.out.println(cos(2 * PI));
            }
        }
      `,
      options: ['It will give compile-time error', 'It will give run-time error', '1.0', '3.14'],
      answer: 0,
      explain: 'cos and PI are not imported (java.lang.Math is not static-imported), so the code does not compile.',
    },
    {
      q: 'Consider the following code. What will be the output of the code given below?',
      code: java`
        class Person {
            int a = 1;
            int b = 1;

            public Person() {
                System.out.print(a * b + "Java" + a);
            }
        }

        class Employee extends Person {
            int a = 0;
            int b = 1;

            public Employee() {
                System.out.print(a + b + "Java" + a);
            }
        }

        public class Question {
            public static void main(String args[]) {
                Person p = new Employee();
            }
        }
      `,
      options: ['1Java11Java0', '1Java10Java0', '10Java0Java', '0Java11Java0'],
      answer: 0,
      explain:
        'The Person constructor runs first and uses Person\'s own fields: (1*1) + "Java" + 1 = "1Java1". Then Employee\'s constructor: 0 + 1 = 1 (numeric addition happens before the String), giving "1Java0". Together: 1Java11Java0.',
    },
    {
      q: "In Java, can a subclass in a different package access a superclass's protected method?",
      options: [
        'Yes, without any restrictions.',
        'Yes, but only if they are in the same package.',
        'No, protected methods are not accessible by subclasses.',
        'Yes, but only through inheritance (i.e., using super or this, not via an object)',
      ],
      answer: 3,
      source: 'inferred',
    },
    {
      q: 'A package is a collection of:',
      options: ['Only classes', 'Only interfaces', 'editing tools', 'classes, methods and interfaces'],
      answer: 3,
    },
    {
      q: 'Consider the following 2 programs. Choose the best option among the following for the code snippet given above.',
      code: java`
        // Main1.java
        public class Main1 {
            public static void main(String args[]) {
                int number = 10;
                System.out.println(number++ + ++number);
            }
        }

        // Main2.java
        public class Main2 {
            public static void main(String args[]) {
                int number = 10;
                System.out.println(++number + number++);
            }
        }
      `,
      options: [
        'Both pre-increment and post-increment operators becomes pre-increment during print.',
        'Both pre-increment and post-increment operators becomes post-increment during print.',
        'Both Main1 and Main2 classes give the same output (but can depend on the compiler).',
        "Pre-increment and post-increment operators don't work during print.",
      ],
      answer: 2,
      explain: 'Main1: 10 + 12 = 22. Main2: 11 + 11 = 22. Both print 22.',
    },
    {
      q: 'Consider the following program. How many errors does this program contain?',
      code: java`
        class Base {
            public void print() {
                System.out.println("Base class ... ");
            }
        }

        class Derived extends Base {
            public void print() {
                System.out.println("Derived class ... ");
            }
        }

        public class Main {
            private static void main(String[] args) {
                Base b = new Base();
                b.print();
                Derived d = new Derived();
                d.print();
            }
        }
      `,
      options: ['None', '1', '2', '3'],
      answer: 1,
      explain: 'main() must be public for the JVM to launch the program - that is the single error.',
    },
    {
      q: 'Consider the code given below. What is the output of the above Java Code Snippet with protected access modifier?',
      code: java`
        // Teacher.java
        package nptel1;
        public class Teacher {
            protected void showMarks() {
                System.out.println("100 Marks");
            }
        }

        // Student.java
        package nptel2;
        import nptel1.*;
        public class Student extends Teacher {
            void show() {
                showMarks();
            }

            public static void main(String[] args) {
                Student st1 = new Student();
                st1.show();
            }
        }
      `,
      options: ['100 marks', 'No output', 'Compiler error', 'None of the above'],
      answer: 0,
      fixedOptions: true,
      explain: 'A subclass in another package may call an inherited protected method on itself.',
    },
    {
      q: 'Choose the correct syntax of a Java Package below.',
      options: ['package PACKAGE_NAME;', 'package PACKAGE_NAME.*;', 'pkg PACKAGE_NAME;', 'pkg PACKAGE_NAME.*;'],
      answer: 0,
    },
    {
      q: 'Which of these access specifiers must be used for main() method?',
      options: ['private', 'public', 'protected', 'default'],
      answer: 1,
    },
  ],
})
