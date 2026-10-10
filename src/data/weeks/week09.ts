import { defineWeek, java } from '../define'

// Source: weeks/week9.txt, weeks/week10.txt and weeks/week11.txt. All three files are the SAME Swing quiz
// (three OCR scans of one assignment), so they were merged into one set of 10 questions and placed in Week 9.
// Week 9's scan was missing Q6, which was recovered from the Week 10 / 11 scans.
// Q1 originally showed a screenshot of buttons wrapping inside a window; it is described in words here.
export default defineWeek({
  week: 9,
  title: 'AWT & Swing (GUI)',
  questions: [
    {
      q: 'A container displays a number of components in a row, but adjusts (wraps) them according to the window size. Which of the following layout manager(s) is most naturally suited for the layout described?',
      options: ['FlowLayout', 'BorderLayout', 'GridLayout', 'BoxLayout'],
      answer: 0,
    },
    {
      q: 'In Java, what is the primary purpose of a layout manager?',
      options: [
        'To manage memory allocation',
        'To arrange GUI components within a container',
        'To handle exception handling',
        'To control database connections',
      ],
      answer: 1,
    },
    {
      q: 'Consider the following code. What happens when the button in this Java code snippet is clicked?',
      code: java`
        import javax.swing.*;
        import java.awt.event.*;

        public class NPTEL {
            public static void main(String[] args) {
                JFrame frame = new JFrame("NPTEL Java Course");
                JButton button = new JButton("Click Me");
                button.setBounds(50, 100, 100, 40);
                button.addActionListener(new ActionListener() {
                    public void actionPerformed(ActionEvent e) {
                        JOptionPane.showMessageDialog(null, "Welcome to the course");
                    }
                });
                frame.add(button);
                frame.setSize(300, 200);
                frame.setLayout(null);
                frame.setVisible(true);
            }
        }
      `,
      options: [
        'The program exits',
        'A message dialog with the text "Welcome to the course" is displayed',
        'The button label changes to "Welcome to the course"',
        'Nothing happens',
      ],
      answer: 1,
    },
    {
      q: 'Consider the following code. What will be the output of the above code?',
      code: java`
        import javax.swing.*;

        public class NPTEL extends JFrame {
            JButton button;

            public NPTEL() {
                button = new JButton("Programming in Java");
                add(button);
                setSize(300, 200);
                setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                setVisible(true);
            }

            public static void main(String[] args) {
                new NPTEL();
            }
        }
      `,
      options: [
        'Creates a JFrame with a JButton labeled "Programming in Java"',
        'Compiles with errors',
        'Displays a message dialog',
        'Creates a JPanel with a JButton labeled "Programming in Java"',
      ],
      answer: 0,
    },
    {
      q: 'Consider the following code. What should replace // INSERT CODE HERE to create a JFrame with a JButton labeled "Click Me"?',
      code: java`
        import javax.swing.*;

        public class FrameExample {
            public static void main(String[] args) {
                JFrame frame = new JFrame("Demo Frame");
                JButton button = new JButton("Click Me");
                // INSERT CODE HERE
                frame.setSize(300, 200);
                frame.setVisible(true);
            }
        }
      `,
      options: ['frame.add(button);', 'frame.insert(button);', 'frame.append(button);', 'frame.push(button);'],
      answer: 0,
    },
    {
      q: 'Identify and correct the error in the following program. What should the erroneous line (panel.setFlowLayout();) be replaced with?',
      code: java`
        import javax.swing.*;
        import java.awt.*;

        public class PanelExample {
            public static void main(String[] args) {
                JFrame frame = new JFrame("Panel Example");
                JPanel panel = new JPanel();
                JButton button = new JButton("Submit");
                panel.setFlowLayout();   // ERROR
                panel.add(button);
                frame.add(panel);
                frame.setSize(300, 200);
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setVisible(true);
            }
        }
      `,
      options: [
        'panel.setLayout(new);',
        'panel.addFlowLayout();',
        'panel.appendLayout(new FlowLayout());',
        'panel.setLayout(new FlowLayout());',
      ],
      answer: 3,
    },
    {
      q: 'Which method is used to remove a component from a container in AWT?',
      options: ['remove()', 'deleteComponent()', 'removeComponent()', 'destroy()'],
      answer: 0,
    },
    {
      q: 'Which method is used to handle mouse click events in Java Swing?',
      options: ['mouseClicked()', 'keyPressed()', 'actionPerformed()', 'componentShown()'],
      answer: 0,
    },
    {
      q: 'Which Swing component is best suited for displaying a drop-down list of selectable options?',
      options: ['JButton', 'JComboBox', 'JTextField', 'JPanel'],
      answer: 1,
    },
    {
      q: 'Which of the following function is used to specify the layout of a container?',
      options: ['UseLayout()', 'setLayout()', 'layout()', 'DesignLayout()'],
      answer: 1,
    },
  ],
})
