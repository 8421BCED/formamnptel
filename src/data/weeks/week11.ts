import { defineWeek, java } from '../define'

// Source: weeks/anoweeks/week11.txt (answers taken from NPTEL's "Accepted answer" lines).
// This is the same JDBC set that earlier sat in weeks/week12.txt / weeknext.txt - it belongs to Week 11.
export default defineWeek({
  week: 11,
  title: 'JDBC',
  questions: [
    {
      q: 'How do you establish a connection to a database using JDBC?',
      options: [
        'By creating an instance of the Connection interface',
        'By using the DriverManager.getConnection() method',
        'By implementing the Connection interface',
        'By extending the Connection class',
      ],
      answer: 1,
    },
    {
      q: 'Which method executes a simple query and returns a single ResultSet object?',
      options: ['executeQuery()', 'executeUpdate()', 'execute()', 'run()'],
      answer: 0,
    },
    {
      q: 'Which of the following ensures that the correct driver is used to access each data source?',
      options: ['java.sql.Manager', 'java.sql.DriverManager', 'java.sql.Statement', 'java.sql.DriverSession'],
      answer: 1,
    },
    {
      q: 'What is the purpose of the ResultSet interface in JDBC?',
      options: [
        'To store the result of a query',
        'To execute SQL queries',
        'To manage database connections',
        'To update data in the database',
      ],
      answer: 0,
    },
    {
      q: 'What does setAutoCommit(false) do?',
      options: [
        'commits transaction after each query',
        'explicitly commits transaction',
        'does not commit transaction automatically after each query',
        'never commits transaction',
      ],
      answer: 2,
    },
    {
      q: 'The following is a statement in Java using JDBC. Which of the following statements is FALSE?',
      code: java`
        Connection con = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/nptel", "joy", "java"
        );
      `,
      options: [
        '3306 is the default MySQL port.',
        "Database name is 'nptel'",
        'The database server is hosted on IP 127.0.0.1',
        "Username is 'java' and the password is 'joy'",
      ],
      answer: 3,
      explain:
        'The arguments are (url, user, password): the username is "joy" and the password is "java" - the statement has them swapped.',
    },
    {
      q: 'What is the correct order to close database resources?',
      options: [
        'Connection then Statement then ResultSet',
        'ResultSet then Statement then Connection',
        'Statement then Connection then ResultSet',
        'Statement then ResultSet then Connection',
      ],
      answer: 1,
    },
    {
      q: 'What is the full form of JDBC?',
      options: ['Java Database Connectivity', 'Java Data Code', 'Java Data Communication', 'Java Development Connectivity'],
      answer: 0,
    },
    {
      q: 'Fill in the missing code to establish a connection to a MySQL database. What should replace // INSERT CODE HERE?',
      code: java`
        import java.sql.*;

        public class JDBCExample {
            public static void main(String[] args) {
                try {
                    // Load JDBC Driver
                    Class.forName("com.mysql.cj.jdbc.Driver");

                    // Establish Connection
                    Connection connection = // INSERT CODE HERE;

                    System.out.println("Connected to the database.");
                    connection.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
      `,
      options: [
        'DriverManager.connect("mysql:localhost:mydb", "user", "password");',
        'DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb", "user", "password");',
        'Connection.get("jdbc:mysql://localhost:3306/mydb", "user", "password");',
        'Driver.connect("jdbc:mysql://localhost:mydb", "user", "password");',
      ],
      answer: 1,
    },
    {
      q: 'What is the purpose of the DriverManager class in JDBC?',
      options: [
        'To manage database connections.',
        'To execute SQL queries.',
        'To fetch data from a database.',
        'To represent a database record.',
      ],
      answer: 0,
    },
  ],
})
