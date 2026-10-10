import { defineWeek, java } from '../define'

// Source: weeks/week3.txt (answers taken from NPTEL's "Accepted answer" lines).
export default defineWeek({
  week: 3,
  title: 'Inheritance, Polymorphism & final',
  questions: [
    {
      q: 'Which of the following statements is true regarding the order of execution of constructors in an inheritance hierarchy?',
      options: [
        'Derived class constructor will be called followed by the base class constructor.',
        'Only Base class constructor will be called.',
        'Only derived class constructor will be called.',
        'Base class constructor will be called followed by the derived class constructor.',
      ],
      answer: 3,
    },
    {
      q: 'The super() method is used to:',
      options: [
        'Call constructor of friend class',
        'Call constructor of the parent class',
        'Call constructor',
        'Is a declared method',
      ],
      answer: 1,
    },
    {
      q: 'What is the output of the following Java program?',
      code: java`
        class Vehicle {
            public void move() {
                System.out.println("The vehicle moves");
            }
        }

        class Car extends Vehicle {
            public void move() {
                System.out.println("The car moves");
            }
        }

        public class Main {
            public static void main(String[] args) {
                Vehicle vehicle = new Car();
                vehicle.move();
            }
        }
      `,
      options: ['"The vehicle moves"', '"The car moves"', 'The code does not compile', 'None of the above'],
      answer: 1,
      fixedOptions: true,
      explain: 'Method calls are resolved by the actual object type at run time (dynamic dispatch), so Car.move() runs.',
    },
    {
      q: 'Which of the following is NOT true regarding the final keyword in Java?',
      options: [
        'A final method cannot be overridden in a subclass.',
        'A final variable can only be assigned once.',
        'A final class can have subclasses.',
        'A final variable can be assigned during declaration or in the constructor.',
      ],
      answer: 2,
    },
    {
      q: 'Which type of inheritance leads to the "Diamond Problem"?',
      options: ['Single level', 'Multi-level', 'Multiple', 'Hierarchical'],
      answer: 2,
    },
    {
      q: 'Members of a class which are not intended to be inherited by subclasses should be declared as:',
      options: ['Public members', 'Protected members', 'Private members', 'Private or Protected members'],
      answer: 2,
    },
    {
      q: 'In Java, is it possible to override a static method?',
      options: [
        'Yes, we can override a static method just like we do with instance methods.',
        'No, static methods cannot be overridden because they belong to the class, not the object.',
        'It depends on whether the static method is declared as final or not.',
        'It depends on the access modifier of the static method.',
      ],
      answer: 1,
    },
    {
      q: 'What is the output of the following Java program?',
      code: java`
        public class NptelExample {
            public static int fun(int n) {
                if (n == 0) {
                    return 1;
                }
                return n * fun(n - 1);
            }

            public static void main(String[] args) {
                System.out.println(fun(5));
            }
        }
      `,
      options: ['5', '24', '120', 'Runtime Error'],
      answer: 2,
    },
    {
      q: 'Which of the following statements about abstract classes in Java is correct?',
      options: [
        'Abstract classes can be instantiated directly.',
        'An abstract class must contain at least one abstract method.',
        'A class inheriting from an abstract class must implement all its abstract methods unless it is itself abstract.',
        'Abstract classes can be marked as final.',
      ],
      answer: 2,
    },
    {
      q: 'What will be the output of the below program?',
      code: java`
        class superDemoClass {
            final int a = 20;
        }

        class subDemoClass extends superDemoClass {
            void subFunc() {
                a = 40;
                System.out.println("value of a = " + a);
            }
        }

        class demo {
            public static void main(String[] args) {
                subDemoClass subc = new subDemoClass();
                subc.subFunc();
            }
        }
      `,
      options: [
        'value of a = 20',
        'error: cannot assign a value to final variable a',
        "error: unknown variable 'a' in class subDemoClass",
        'value of a = 40',
      ],
      answer: 1,
    },
  ],
})
