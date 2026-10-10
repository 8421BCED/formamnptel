import type { RawQuestion } from '../../types'

// PARKED - this file is NOT loaded by the app (only src/data/weeks/*.ts is). The questions are kept here so
// nothing is lost. To bring them back, import this default export into the week file and spread it into
// `questions`, e.g.  questions: [...assignment, ...extra]

// Part 2 - the "Week 1 : Lecture 01 : Introduction" practice page (weeks/week0.txt = weeks/week1.txt).
// That page only had a "View Answer" button, so the answer key was NOT in the files - every answer below is
// marked `inferred`. Least certain: Q2, Q3, Q9 and Q25 (they depend on the lecture's exact wording).
const questions: RawQuestion[] = [
    {
      q: 'According to the lecturer, who is the main instructor of the course?',
      options: ['Tauheed med', 'Niranjan Sinhababu', 'Debasis Samanta', 'James Gosling'],
      answer: 2,
    },
    {
      q: "Which reference book is specifically recommended for beginners because it is 'written in a very simple and easy way'?",
      options: [
        'Complete Reference Java 2, 10th edition',
        'Object Oriented Programming with C++ and Java',
        'The official Java documentation website',
        'Programming with Java by the Green Team',
      ],
      answer: 1,
    },
    {
      q: 'What is the primary activity planned for the final week (Week 12) of the course?',
      options: [
        'A comprehensive final examination.',
        'A series of advanced demonstrations on internet programming.',
        'A review of all topics covered in the 60 lectures.',
        'The development of a mini software project.',
      ],
      answer: 1,
    },
    {
      q: 'What was the initial name of the programming language that would eventually become Java?',
      options: ['Oak', 'Greentalk', 'Sunscript', 'Netscape'],
      answer: 0,
    },
    {
      q: "Who is identified in the lecture as the pioneer of the 'Green Team' that initiated the Java project?",
      options: ['Mike Sheridan', 'Patrick Naughton', 'James Gosling', 'Debasis Samanta'],
      answer: 2,
    },
    {
      q: "The name 'Java' was chosen in 1995. What is the origin of this name as described in the lecture?",
      options: [
        "It was an acronym for 'Just Another Virtual Architecture'.",
        'It was named after an island in Indonesia famous for producing coffee.',
        "It was the lead developer's favorite variety of oak tree.",
        'It was a randomly generated name that was fun to say.',
      ],
      answer: 1,
    },
    {
      q: 'According to the lecture, when was the first official Java Development Kit (JDK 1.0) released?',
      options: [
        'In 1991, by the Green Team.',
        'In 1995, when the name Java was introduced.',
        'In 1996, by Sun Microsystems.',
        'In 2000, after its popularity was established.',
      ],
      answer: 2,
    },
    {
      q: "The lecturer lists several 'buzzwords' or features of Java. Which of the following was NOT mentioned in that list?",
      options: ['Portable', 'Secure', 'Procedural', 'Platform independent'],
      answer: 2,
    },
    {
      q: "Based on the graph and discussion, what does the lecturer conclude about Java's popularity?",
      options: [
        'It is popular, but C++ and C# are more popular.',
        'It has consistently been the most popular language compared to others shown.',
        'Its popularity has been declining steadily over the years.',
        'It is only popular for Android mobile development.',
      ],
      answer: 1,
    },
    {
      q: "The lecture emphasizes that Java is 'platform independent'. What is the practical implication of this feature for a developer?",
      options: [
        'The code needs to be rewritten for every different operating system.',
        'A program written on Windows can run on Linux or macOS without being recompiled, as long as a Java environment is present.',
        'Java programs can run directly on computer hardware without an operating system.',
        'Java is only independent on platforms made by Sun Microsystems.',
      ],
      answer: 1,
      explain: 'Source is compiled to platform-neutral bytecode, which any JVM can run.',
    },
    {
      q: 'What is the key difference between a compiler and an interpreter as explained in the lecture?',
      options: [
        'A compiler checks for errors line-by-line, while an interpreter checks the whole program at once.',
        'An interpreter translates an entire program into machine code at one go, while a compiler executes it statement by statement.',
        'A compiler translates the entire program into machine code before execution, while an interpreter translates and executes one statement at a time.',
        'Compilers are used for high-level languages like Java, while interpreters are for assembly language.',
      ],
      answer: 2,
    },
    {
      q: 'The lecture places Java within a specific generation of programming languages. To which generation does Java belong?',
      options: ['First Generation (1GL)', 'Second Generation (2GL)', 'Third Generation (3GL)', 'Fourth Generation (4GL)'],
      answer: 2,
    },
    {
      q: "A user writes an SQL command to retrieve data from a database. According to the lecture's classification, this is an example of what generation of language and why?",
      options: [
        "3GL, because it's an English-like command.",
        "2GL, because it uses specific keywords like 'SELECT'.",
        "4GL, because the user specifies 'what to do' (get data) rather than 'how to do it'.",
        '3GL, because it interacts with a database, which is a complex task.',
      ],
      answer: 2,
    },
    {
      q: 'What fundamental architectural model is mentioned as the basis for how computers execute programs by loading them into memory?',
      options: [
        'The Java Virtual Machine (JVM) model',
        'The client-server model',
        'The von Neumann architecture',
        'The object-oriented model',
      ],
      answer: 2,
    },
    {
      q: 'What is a defining characteristic of the function-oriented programming paradigm discussed in the lecture?',
      options: [
        'Data is securely hidden within objects and can only be accessed via methods.',
        'The program is built by defining objects that communicate with each other.',
        'The program is broken down into functions that share a common pool of global data.',
        'It follows a bottom-up approach, building small components first.',
      ],
      answer: 2,
    },
    {
      q: 'In contrast to function-oriented programming, how does the object-oriented programming (OOP) paradigm handle data?',
      options: [
        'It relies on a central, global data pool for all objects to share.',
        'It converts all data into functions to simplify the program.',
        'It localizes data by storing it within individual objects, eliminating the need for global data.',
        'It makes all data public to facilitate easy communication between objects.',
      ],
      answer: 2,
    },
    {
      q: "The lecture contrasts the 'top-down' approach of FOP with the 'bottom-up' approach of OOP. What does the 'bottom-up' approach imply in the context of OOP?",
      options: [
        'The program is written from the last line to the first line.',
        'The focus is on low-level machine code before high-level language.',
        'The developer first designs and builds individual, self-contained objects and then assembles them into a complete system.',
        'The main function is designed first, and then it is broken down into smaller and smaller objects.',
      ],
      answer: 2,
    },
    {
      q: "What is the core concept of 'encapsulation' in Java, as defined in the lecture?",
      options: [
        'The ability of an object to take on many forms.',
        'The process of creating new classes based on existing classes.',
        'The bundling of data and the methods that operate on that data into a single unit called a class.',
        "The restriction of access to an object's internal data.",
      ],
      answer: 2,
      explain: "Option 4 describes information hiding, which is a related but separate idea.",
    },
    {
      q: 'A developer creates a `Book` class in a library system, defining its attributes (e.g., `title`, `author`) and methods (e.g., `issueBook()`, `returnBook()`). This act of grouping related data and functions together is a direct example of which OOP principle?',
      options: ['Polymorphism', 'Inheritance', 'Encapsulation', 'Information Hiding'],
      answer: 2,
    },
    {
      q: 'The lecture explains that a `Textbook` class can be created from an existing `Book` class, inheriting its features and adding new ones. This concept is known as:',
      options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Data Hiding'],
      answer: 1,
    },
    {
      q: 'The `add` method is used as an example that can perform different operations: adding numbers, concatenating strings, or merging documents, all while using the same method name. Which OOP principle does this demonstrate?',
      options: ['Encapsulation', 'Inheritance', 'Information Hiding', 'Polymorphism'],
      answer: 3,
    },
    {
      q: 'An application has a `save()` function. When used on a `TextDocument` object, it saves a .txt file. When the same `save()` function is used on an `Image` object, it saves a .jpeg file. This is a practical application of which OOP principle?',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Database Connectivity'],
      answer: 1,
    },
    {
      q: "What is the primary purpose of 'information hiding' in object-oriented programming?",
      options: [
        'To bundle data and methods together into a class.',
        'To allow one class to acquire the properties of another class.',
        'To make the code unreadable to prevent theft.',
        "To restrict direct access to an object's internal state, protecting it from unintended modification.",
      ],
      answer: 3,
    },
    {
      q: 'Which category of Java programming is used for developing large-scale system and application software, utilizing concepts like multithreading, packages, and exception handling?',
      options: ['Java Applet', 'Java Core', 'Java for Internet Programming', 'Java Script'],
      answer: 1,
    },
    {
      q: "If a developer needs to build a graphical user interface (GUI) using 'Java swing' or a 'windows toolkit', which area of Java programming would they be working in?",
      options: ['Java Core', 'Java Applet', 'JDBC', 'Java JSP'],
      answer: 1,
    },
]

// Every answer here is a guess (the source page had no answer key), so they are all marked `inferred`.
export default questions.map((q): RawQuestion => ({ ...q, source: 'inferred' }))
