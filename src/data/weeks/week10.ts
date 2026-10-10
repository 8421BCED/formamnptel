import { defineWeek } from '../define'

// Source: weeks/anoweeks/week10.txt (answers taken from NPTEL's "Accepted answer" lines).
export default defineWeek({
  week: 10,
  title: 'Swing, JDBC & Networking Basics',
  questions: [
    {
      q: 'Which Swing component is used to display a window?',
      options: ['JFrame', 'JButton', 'JLabel', 'JTextField'],
      answer: 0,
    },
    {
      q: 'Which Swing component is used to enter a single line of text?',
      options: ['JButton', 'JLabel', 'JTextField', 'JPanel'],
      answer: 2,
    },
    {
      q: 'Which Swing component is commonly used to display non-editable text?',
      options: ['JLabel', 'JButton', 'JFrame', 'JTextField'],
      answer: 0,
    },
    {
      q: 'Which JDBC interface is used to execute SQL statements?',
      options: ['ResultSet', 'Statement', 'Connection', 'DriverManager'],
      answer: 1,
    },
    {
      q: 'Which JDBC object contains the result of a SELECT query?',
      options: ['Connection', 'Statement', 'ResultSet', 'DriverManager'],
      answer: 2,
    },
    {
      q: 'Which JDBC class is used to establish a database connection?',
      options: ['DriverManager', 'ResultSet', 'Statement', 'Scanner'],
      answer: 0,
    },
    {
      q: 'Which Java class is used to connect a client to a server?',
      options: ['ServerSocket', 'Socket', 'URL', 'NetworkInterface'],
      answer: 1,
    },
    {
      q: 'Which class is used by a server to listen for client connections?',
      options: ['Socket', 'URL', 'ServerSocket', 'NetworkInterface'],
      answer: 2,
    },
    {
      q: 'Which protocol is used in the URL https://nptel.ac.in?',
      options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'],
      answer: 2,
    },
    {
      q: 'Which method of NetworkInterface is used to check whether a network interface is up?',
      options: ['isActive()', 'isUp()', 'isRunning()', 'isConnected()'],
      answer: 1,
    },
  ],
})
