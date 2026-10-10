import type { RawQuestion } from '../../types'
import { java } from '../define'

// PARKED - this file is NOT loaded by the app (only src/data/weeks/*.ts is). The questions are kept here so
// nothing is lost. To bring them back, import this default export into the week file and spread it into
// `questions`, e.g.  questions: [...assignment, ...extra]

// Part 2 - weeks/week8.1.txt - week8.5.txt are programming assignments (code to write, no MCQs), so these
// questions were WRITTEN for this portal from each assignment's topic. All programs were compiled and run.
const questions: RawQuestion[] = [
    {
      // 8.1 - creating a thread with the Thread class
      q: 'What is the output of the following program?',
      code: java`
        public class WeekEight {
            static class MyThread extends Thread {
                @Override
                public void run() {
                    System.out.println("Thread is running");
                }
            }

            public static void main(String[] args) {
                MyThread t = new MyThread();
                t.start();
            }
        }
      `,
      options: [
        'Thread is running',
        'Nothing is printed, because run() is never called',
        'Compilation error: MyThread must be a top-level public class',
        'Thread is running (printed twice)',
      ],
      answer: 0,
      explain: 'start() creates a new thread, and that thread calls run().',
    },
    {
      q: 'What is the difference between calling t.run() and t.start() on a Thread object t?',
      options: [
        'run() executes the task in the current thread like an ordinary method call; start() creates a new thread which then calls run().',
        'They are identical; start() is just another name for run().',
        'run() creates a new thread; start() runs the code on the main thread.',
        'start() may be called any number of times, but run() only once.',
      ],
      answer: 0,
    },
    {
      // 8.2 - the Runnable interface
      q: 'Why might a class implement Runnable instead of extending Thread?',
      options: [
        'Java supports only single inheritance; implementing Runnable leaves the class free to extend another class.',
        'Runnable threads run faster than Thread subclasses.',
        'A class that implements Runnable does not need a run() method.',
        'Thread is an interface, so it cannot be extended.',
      ],
      answer: 0,
    },
    {
      q: 'Which statement correctly starts a new thread that executes the run() method of a Runnable object r?',
      options: ['new Thread(r).start();', 'r.start();', 'new Thread().run(r);', 'Thread.start(r);'],
      answer: 0,
      explain: 'Runnable only declares run(). To get a new thread, pass the Runnable to a Thread constructor and call start() on the Thread.',
    },
    {
      // 8.3 - thread states and join()
      q: 'What is the output of the following program?',
      code: java`
        public class Join {
            static class MyThread extends Thread {
                public void run() {
                    System.out.println("Thread is running");
                }
            }

            public static void main(String[] args) throws InterruptedException {
                MyThread t = new MyThread();
                System.out.println("before start");
                t.start();
                t.join();
                System.out.println("after completion");
            }
        }
      `,
      options: [
        'before start\nThread is running\nafter completion',
        'before start\nafter completion\nThread is running',
        'Thread is running\nbefore start\nafter completion',
        'after completion\nbefore start\nThread is running',
      ],
      answer: 0,
      explain: 'join() makes the main thread wait until t has finished, so "after completion" always comes last.',
    },
    {
      q: 'In which state is a Java thread right after it is created with new, but before start() is called?',
      options: ['NEW', 'RUNNABLE', 'BLOCKED', 'TERMINATED'],
      answer: 0,
    },
    {
      // 8.4 - thread priority
      q: 'What is the output of the following program?',
      code: java`
        public class Prio {
            static class MyThread extends Thread {
                public void run() { }   // prints nothing
            }

            public static void main(String[] args) {
                MyThread t = new MyThread();
                t.setPriority(8);
                t.start();
                System.out.println("Thread priority is: " + t.getPriority());
            }
        }
      `,
      options: [
        'Thread priority is: 8',
        'Thread priority is: 5',
        'Thread priority is: 10',
        'Compilation error: setPriority() only accepts Thread.MAX_PRIORITY',
      ],
      answer: 0,
      explain: 'The default priority is 5 (NORM_PRIORITY), but setPriority(8) changed it before getPriority() was called.',
    },
    {
      q: 'Which range of values is valid for a thread priority in Java?',
      options: ['1 to 10', '0 to 9', '0 to 10', '1 to 5'],
      answer: 0,
      explain: 'Thread.MIN_PRIORITY = 1, Thread.NORM_PRIORITY = 5, Thread.MAX_PRIORITY = 10. Anything outside throws IllegalArgumentException.',
    },
    {
      // 8.5 - synchronization
      q: 'What is the output of the following program?',
      code: java`
        public class Sync {
            static class Counter {
                int count = 0;
                public synchronized void increment() { count++; }
            }

            static class MyThread extends Thread {
                Counter c;
                MyThread(Counter c) { this.c = c; }
                public void run() {
                    for (int i = 0; i < 1000; i++) c.increment();
                }
            }

            public static void main(String[] args) throws InterruptedException {
                Counter c = new Counter();
                MyThread t1 = new MyThread(c);
                MyThread t2 = new MyThread(c);
                t1.start();
                t2.start();
                t1.join();
                t2.join();
                System.out.println("Final count is: " + c.count);
            }
        }
      `,
      options: [
        'Final count is: 2000',
        'Final count is: 1000',
        'A value between 1000 and 2000 that can differ from run to run',
        'Compilation error: synchronized cannot be applied to a method',
      ],
      answer: 0,
    },
    {
      q: 'Two threads each execute count++ 1000 times on the same shared counter, but increment() is NOT synchronized. What can happen?',
      options: [
        'The final count may be less than 2000 because of a race condition (lost updates).',
        'The final count is always exactly 2000.',
        'The program does not compile.',
        'One thread is blocked forever (deadlock).',
      ],
      answer: 0,
      explain: 'count++ is read-modify-write, not atomic. Two threads can read the same value and both write back value + 1, losing an update.',
    },
]

// These were written for this site from the Week 8 programming assignments, so they are marked `derived`.
export default questions.map((q): RawQuestion => ({ ...q, source: 'derived' }))
