import { defineWeek, java } from '../define'

// Source: weeks/week2.txt (answers taken from NPTEL's "Accepted answer" lines).
// Code snippets were rebuilt from OCR text and every output was re-checked by compiling and running it.
export default defineWeek({
  week: 2,
  title: 'Java Basics, Constructors & Console I/O',
  questions: [
    {
      q: 'What is the correct signature of the main method in Java?',
      options: [
        'public static void main(String[] args)',
        'public void main(String args[])',
        'void main(String[] args)',
        'public static void main(Sting [])',
      ],
      answer: 0,
    },
    {
      q: 'Consider the code given below. What will be the output of the above Java program?',
      code: java`
        public class VarPrint {
            int x = 30;
            static int y = 20;

            public static void main(String[] args) {
                VarPrint t1 = new VarPrint();
                t1.x = 88;
                t1.y = 99;
                int z1 = t1.x + t1.y;
                VarPrint t2 = new VarPrint();
                System.out.println(t2.x + " " + t2.y + " " + z1);
            }
        }
      `,
      options: ['30 99 178', '30 88 129', '30 99 187', '99 99 187'],
      answer: 2,
      explain:
        'y is static, so t1.y = 99 changes the single shared copy. z1 = 88 + 99 = 187. t2 gets a fresh x = 30 but still sees y = 99.',
    },
    {
      q: 'Consider the code given below. What will be the output of the code?',
      code: java`
        public class ArgumenTest {
            public static void main(String[] args) {
                Test t = new Test();
                t.start();
            }

            static class Test {
                void start() {
                    int a = 4;
                    int b = 5;
                    System.out.print("" + 8 + 3 + "");
                    System.out.print(a + b);
                    System.out.print(" " + a + b + "");
                    System.out.print(foo() + a + b + " ");
                    System.out.println(a + b + foo());
                }

                String foo() {
                    return "foo";
                }
            }
        }
      `,
      options: ['839 45foo45 9foo', '9 7 7 foo34 34foo', '72 34 34 foo34 34foo', '839 45foo45 9foo9'],
      answer: 0,
      explain:
        'Once a String is involved, + concatenates left to right: "" + 8 + 3 = "83". a + b alone is arithmetic (9). " " + a + b = " 45". foo() + a + b = "foo45". a + b + foo() = 9 + "foo" = "9foo".',
    },
    {
      q: 'Which keyword is used in Java to refer to the current object?',
      options: ['this', 'that', 'self', 'current'],
      answer: 0,
    },
    {
      q: 'Which of the following is true about constructors in a class?',
      options: [
        'Constructors do not have a return type.',
        "Constructors aren't used to initialize objects.",
        'A class can have only one constructor.',
        'Constructors cannot be overloaded.',
      ],
      answer: 0,
    },
    {
      q: 'Consider the following code snippet. What will be the output of the code given below?',
      code: java`
        class NPTEL_W2 {
            int x;

            NPTEL_W2(int x) {
                this.x = x;
            }

            void printx() {
                System.out.println(this.x);
            }

            public static void main(String[] args) {
                NPTEL_W2 obj = new NPTEL_W2(0);
                obj.printx();
            }
        }
      `,
      options: ['0', '10', '100', 'Runtime error'],
      answer: 0,
    },
    {
      q: 'Consider the code snippet given below (\\n in the output is to be assumed to be the new line character). What will be the output of the code?',
      code: java`
        public class Main {
            public static void main(String[] args) {
                System.out.println("Hello");
                System.out.println("World");
                System.out.printf("Number: %d", 10);
            }
        }
      `,
      options: [
        'Hello World\\nNumber: 10',
        'Hello WorldNumber: 10',
        'Hello\\nWorld\\nNumber: 10',
        'Hello World\\nNumber: 10\\n',
      ],
      answer: 2,
      explain: 'println ends each line with a newline; printf does not add one, so the output ends right after "10".',
    },
    {
      q: 'Which class is used in Java to take runtime data input from the user?',
      options: ['BufferedReader', 'UserInputStreamReader', 'Scanner', 'DataInputStreamReader'],
      answer: 2,
    },
    {
      q: 'How do you read a line of text from the console using the Scanner class in Java?',
      options: ['scanner.readLine()', 'scanner.nextLine()', 'scanner.getLine()', 'scanner.fetchLine()'],
      answer: 1,
    },
    {
      q: 'Which of the following is the correct way to declare a class in Java?',
      options: [
        'public class MyClass {}',
        'class MyClass[]{}',
        'public MyClass class {}',
        'MyClass public class {}',
      ],
      answer: 0,
    },
  ],
})
