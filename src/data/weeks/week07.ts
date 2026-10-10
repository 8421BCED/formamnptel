import { defineWeek, java } from '../define'

// Source: weeks/week7.txt (answers taken from NPTEL's "Accepted answer" lines).
// Q8 and Q9 had no answer line in the file - those two are marked `inferred`.
// Q6 and Q7 repeat Week 6 questions with slightly different options; mixed/random exams de-duplicate them.
export default defineWeek({
  week: 7,
  title: 'File I/O & Core Concepts',
  questions: [
    {
      q: 'What will be the output of the following Java program? Assume NPTEL.txt contains: "This is Programming in Java online course."',
      code: java`
        import java.io.*;

        class ReadFile {
            public static void main(String[] args) throws IOException {
                FileReader fr = new FileReader("NPTEL.txt");
                BufferedReader br = new BufferedReader(fr);
                System.out.println(br.readLine());
                br.close();
            }
        }
      `,
      options: ['Hello, World!', 'This is Programming in Java online course.', 'IOException', 'null'],
      answer: 1,
    },
    {
      q: 'Complete the following snippet with the required code (fill in the blank).',
      code: java`
        File file = new File("file.txt");
        if (/* fill in the blank */) {
            System.out.println("File exists.");
        } else {
            System.out.println("File does not exist.");
        }
      `,
      options: ['file.exists()', 'file.isFile()', 'file.fileExists()', 'file.isAvailable()'],
      answer: 0,
    },
    {
      q: 'What is the output of the following Java program?',
      code: java`
        class Main {
            public static void main(String args[]) {
                final int i;
                i = 20;
                i = 30;
                System.out.println(i);
            }
        }
      `,
      options: ['30', 'Compiler Error', 'Garbage value', '0'],
      answer: 1,
      explain: 'A final local variable may be assigned only once - the second assignment is a compile-time error.',
    },
    {
      q: 'Which of these values is returned by read() method when the end of file (EOF) is encountered?',
      options: ['0', '1', '-1', 'Null'],
      answer: 2,
    },
    {
      q: 'What will be the output of the following Java program?',
      code: java`
        public class Calculator {
            int num = 100;

            public void calc(int num) {
                this.num = num * 10;
            }

            public void printNum() {
                System.out.println(num);
            }

            public static void main(String[] args) {
                Calculator obj = new Calculator();
                obj.calc(2);
                obj.printNum();
            }
        }
      `,
      options: ['20', '100', '1000', '2'],
      answer: 0,
      explain: 'calc(2) stores 2 * 10 = 20 into the field (this.num). printNum() prints the field.',
    },
    {
      q: 'What is the primary difference between Byte Streams and Character Streams in Java?',
      options: [
        'Byte Streams handle characters, while Character Streams handle bytes.',
        'Byte Streams are used for binary data, while Character Streams are used for image data.',
        'Character Streams are faster than Byte Streams in all cases.',
        'Byte Streams are used for binary data, while Character Streams are used for text data.',
      ],
      answer: 3,
    },
    {
      q: 'What is the primary purpose of thread synchronization in Java?',
      options: [
        'To allow multiple threads to execute a method at the same time',
        'To ensure thread execution follows a specific order',
        'To ensure data inconsistency',
        'To prevent race conditions and ensure data consistency',
      ],
      answer: 3,
    },
    {
      q: 'Which stream does Java application uses to only READ data from a source, it may be a file, an array, peripheral device or socket?',
      options: ['InputStream', 'OutputStream', 'Input/OutputStream', 'DataOutputStream'],
      answer: 0,
      source: 'inferred',
    },
    {
      q: 'Which class in Java is used to create a new directory?',
      options: ['FileReader', 'FileWriter', 'File', 'Directory'],
      answer: 2,
      source: 'inferred',
      explain: 'File.mkdir() / File.mkdirs() create directories.',
    },
    {
      q: 'What is the primary purpose of input streams in Java?',
      options: ['To write data to a file.', 'To read data from a file.', 'To delete a file.', 'To create directories.'],
      answer: 1,
    },
  ],
})
