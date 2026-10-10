import { defineWeek, java } from '../define'

// Source: weeks/week6.txt (answers taken from NPTEL's "Accepted answer" lines).
export default defineWeek({
  week: 6,
  title: 'Streams & Multithreading',
  questions: [
    {
      q: 'What is the primary difference between Byte Streams and Character Streams in Java?',
      options: [
        'Byte Streams handle characters, while Character Streams handle bytes.',
        'Byte Streams are used for binary data, while Character Streams are used for decimal data.',
        'Character Streams are faster than Byte Streams in all cases.',
        'Byte Streams are used for binary data, while Character Streams are used for text data.',
      ],
      answer: 3,
    },
    {
      q: 'Which of the following best describes the concept of multithreading in Java?',
      options: [
        'Multiple threads execute concurrently, sharing the same memory space.',
        'Only one thread executes at a time, ensuring sequential execution.',
        'Threads in Java cannot communicate with each other.',
        'Threads require separate memory allocation for each thread to run.',
      ],
      answer: 0,
    },
    {
      q: 'Consider the code given below. What will happen when the above code is executed?',
      code: java`
        class ExampleThread extends Thread {
            public void run() {
                System.out.println("Thread is running.");
            }
        }

        public class Main {
            public static void main(String[] args) {
                ExampleThread thread = new ExampleThread();
                thread.start();
                //thread.start();
            }
        }
      `,
      options: [
        'The program will execute successfully, printing "Thread is running." twice.',
        'The program will throw an error when attempting to start the thread a second time.',
        'The program will terminate without any output.',
        'The program will execute successfully, printing "Thread is running."',
      ],
      answer: 3,
      explain: 'The second start() call is commented out, so the thread starts exactly once.',
    },
    {
      q: 'Which method is used to start a thread in Java?',
      options: ['run()', 'start()', 'execute()', 'begin()'],
      answer: 1,
    },
    {
      q: 'Consider the code given below. What will happen when the above code is executed?',
      code: java`
        class RunnableExample implements Runnable {
            public void run() {
                for (int i = 1; i <= 3; i++) {
                    System.out.println("Thread running: " + i);
                }
            }
        }

        public class Main {
            public static void main(String[] args) {
                RunnableExample task = new RunnableExample();
                Thread thread = new Thread(task);
                thread.start();
            }
        }
      `,
      options: [
        'The program will throw a compile-time error because Runnable is not a thread.',
        'The program will execute successfully, and the run() method will run in a new thread.',
        'The program will execute the run() method directly on the main thread.',
        'The program will throw a runtime error because Runnable is not properly implemented.',
      ],
      answer: 1,
    },
    {
      q: 'Which of the following states can a thread enter during its lifecycle in Java?',
      options: [
        'New, Runnable, Running, Blocked',
        'New, Runnable, Waiting, Blocked',
        'New, Runnable, Running, Sleeping, Dead',
        'New, Runnable, Waiting, Blocked, Terminated',
      ],
      answer: 3,
    },
    {
      q: 'What does the thread scheduler use to decide which thread to run when multiple threads are in the runnable state?',
      options: ['Thread priority', "Thread's execution time", 'Thread name', 'Thread creation order'],
      answer: 0,
    },
    {
      q: 'Consider the code given below. Which of the following is true about the output?',
      code: java`
        class PriorityExample extends Thread {
            public void run() {
                System.out.println(Thread.currentThread().getName() +
                    " with priority " +
                    Thread.currentThread().getPriority());
            }
        }

        public class Main {
            public static void main(String[] args) {
                PriorityExample t1 = new PriorityExample();
                PriorityExample t2 = new PriorityExample();

                t1.setPriority(Thread.MIN_PRIORITY);
                t2.setPriority(Thread.MAX_PRIORITY);

                t1.start();
                t2.start();
            }
        }
      `,
      options: [
        'The thread with the higher priority is guaranteed to execute first.',
        'The thread with the lower priority will never execute.',
        'The order of execution depends on the JVM and OS scheduling policies.',
        'The program will throw an error due to invalid priority values.',
      ],
      answer: 2,
    },
    {
      q: 'What is the primary purpose of thread synchronization in Java?',
      options: [
        'To allow multiple threads to execute a method at the same time',
        'To ensure thread execution follows a specific order',
        'To prevent rare conditions and ensure data in-consistency',
        'To prevent race conditions and ensure data consistency',
      ],
      answer: 3,
    },
    {
      q: 'Which of the following method returns a reference to the currently executing thread object?',
      options: [
        'public static boolean interrupted();',
        'public static Thread currentThread();',
        'public final boolean isAlive();',
        'public final void suspend();',
      ],
      answer: 1,
    },
  ],
})
