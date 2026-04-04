import { User, Quiz, Score } from '../types';

export const seedUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    passwordHash: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: new Date('2023-01-15').getTime(),
    badges: ['First Quiz', 'Perfect Score', 'Quiz Creator'],
  },
  {
    id: 'user-2',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    passwordHash: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: new Date('2023-02-20').getTime(),
    badges: ['First Quiz', 'Speed Demon'],
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    passwordHash: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    createdAt: new Date('2023-03-10').getTime(),
    badges: ['First Quiz'],
  },
  {
    id: 'user-4',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    passwordHash: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    createdAt: new Date('2023-04-05').getTime(),
    badges: ['First Quiz', 'Perfect Score', 'Night Owl'],
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david@example.com',
    passwordHash: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    createdAt: new Date('2023-05-12').getTime(),
    badges: ['First Quiz', 'Quiz Creator'],
  }
];

export const seedQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts, including closures, promises, and array methods.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1627398240309-08b91442c4c3?auto=format&fit=crop&q=80&w=800',
    tags: ['javascript', 'programming', 'web'],
    createdAt: new Date('2023-06-01').getTime(),
    attempts: 1245,
    rating: 4.8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What will `console.log(typeof null)` output?',
        options: ['"null"', '"undefined"', '"object"', '"number"'],
        correctAnswer: '"object"',
        points: 10,
        explanation: 'In JavaScript, typeof null is a known bug that returns "object".'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which method removes the last element from an array and returns that element?',
        options: ['pop()', 'push()', 'shift()', 'unshift()'],
        correctAnswer: 'pop()',
        points: 10,
        explanation: 'The pop() method removes the last element from an array and returns that element. This method changes the length of the array.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        image: null,
        text: 'What is a closure in JavaScript?',
        options: [
          'A function that takes another function as an argument',
          'A function bundled together with its lexical environment',
          'A way to prevent variables from being garbage collected',
          'A method to close a browser window'
        ],
        correctAnswer: 'A function bundled together with its lexical environment',
        points: 15,
        explanation: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'World History Trivia',
    description: 'Journey through time and test your knowledge of major historical events and figures.',
    createdBy: 'user-2',
    category: 'History',
    difficulty: 'Hard',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'world', 'trivia'],
    createdAt: new Date('2023-06-15').getTime(),
    attempts: 856,
    rating: 4.5,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'In which year did the Berlin Wall fall?',
        options: ['1987', '1989', '1991', '1993'],
        correctAnswer: '1989',
        points: 10,
        explanation: 'The Berlin Wall fell on November 9, 1989, marking a pivotal moment in the collapse of communism in Eastern Europe.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Who was the first Emperor of Rome?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'],
        correctAnswer: 'Augustus',
        points: 15,
        explanation: 'Augustus (formerly Octavian) became the first Roman Emperor in 27 BC after the demise of the Roman Republic.'
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Space Exploration',
    description: 'Explore the cosmos with this quiz about planets, stars, and human spaceflight.',
    createdBy: 'user-5',
    category: 'Science',
    difficulty: 'Easy',
    timeLimit: 15,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    tags: ['space', 'astronomy', 'science'],
    createdAt: new Date('2023-07-02').getTime(),
    attempts: 2103,
    rating: 4.9,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        points: 10,
        explanation: 'Mars is often called the Red Planet due to the iron oxide prevalent on its surface, which gives it a reddish appearance.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Who was the first human to journey into outer space?',
        options: ['Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'John Glenn'],
        correctAnswer: 'Yuri Gagarin',
        points: 10,
        explanation: 'Yuri Gagarin, a Soviet cosmonaut, became the first human in space on April 12, 1961.'
      }
    ]
  },
  {
    id: 'quiz-4',
    title: 'Advanced Cellular Biology',
    description: 'Identify cellular structures and their functions. Features detailed diagrams and a strict time limit.',
    createdBy: 'user-1',
    category: 'Science',
    difficulty: 'Hard',
    timeLimit: 15,
    coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    tags: ['biology', 'science', 'cells', 'diagrams'],
    createdAt: new Date('2023-08-10').getTime(),
    attempts: 342,
    rating: 4.7,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
        text: 'Identify the organelle highlighted in the diagram responsible for ATP production.',
        options: ['Nucleus', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
        correctAnswer: 'Mitochondria',
        points: 20,
        explanation: 'Mitochondria are known as the powerhouses of the cell, generating most of the cells supply of adenosine triphosphate (ATP).'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
        text: 'What is the primary function of the structure shown here?',
        options: ['Energy production', 'Protein synthesis', 'Selective permeability', 'DNA storage'],
        correctAnswer: 'DNA storage',
        points: 20,
        explanation: 'The double helix structure shown is DNA, which stores genetic information.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        image: null,
        text: 'Which phase of mitosis is depicted when sister chromatids are pulled apart?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctAnswer: 'Anaphase',
        points: 20,
        explanation: 'During anaphase, the sister chromatids separate and move towards opposite poles of the cell.'
      }
    ]
  },
  {
    id: 'quiz-5',
    title: 'World Capitals',
    description: 'Can you name the capital cities of these countries?',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    tags: ['geography', 'capitals', 'world'],
    createdAt: new Date('2023-08-15').getTime(),
    attempts: 1520,
    rating: 4.6,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correctAnswer: 'Canberra',
        points: 10,
        explanation: 'Canberra is the capital city of Australia, chosen as a compromise between Sydney and Melbourne.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'What is the capital of Canada?',
        options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
        correctAnswer: 'Ottawa',
        points: 10,
        explanation: 'Ottawa is the capital of Canada, located in the province of Ontario.'
      }
    ]
  },
  {
    id: 'quiz-6',
    title: 'Python Basics',
    description: 'Test your knowledge of Python syntax and basic concepts.',
    createdBy: 'user-4',
    category: 'Tech',
    difficulty: 'Easy',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['python', 'programming', 'coding'],
    createdAt: new Date('2023-09-01').getTime(),
    attempts: 2800,
    rating: 4.8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'How do you create a function in Python?',
        options: ['function myFunc()', 'def myFunc():', 'create myFunc()', 'func myFunc():'],
        correctAnswer: 'def myFunc():',
        points: 10,
        explanation: 'In Python, the "def" keyword is used to define a function.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which collection is ordered, changeable, and allows duplicate members?',
        options: ['List', 'Tuple', 'Set', 'Dictionary'],
        correctAnswer: 'List',
        points: 10,
        explanation: 'A List in Python is ordered, changeable, and allows duplicate values.'
      }
    ]
  },
  {
    id: 'quiz-7',
    title: 'Marvel Cinematic Universe',
    description: 'How well do you know the MCU?',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Medium',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=800',
    tags: ['movies', 'marvel', 'mcu'],
    createdAt: new Date('2023-09-10').getTime(),
    attempts: 4500,
    rating: 4.9,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the name of Thors hammer?',
        options: ['Stormbreaker', 'Mjolnir', 'Gungnir', 'Aesir'],
        correctAnswer: 'Mjolnir',
        points: 10,
        explanation: 'Thors original hammer is named Mjolnir, forged in the heart of a dying star.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Who is the Winter Soldier?',
        options: ['Steve Rogers', 'Sam Wilson', 'Bucky Barnes', 'Clint Barton'],
        correctAnswer: 'Bucky Barnes',
        points: 10,
        explanation: 'Bucky Barnes, Steve Rogers childhood friend, was brainwashed and turned into the Winter Soldier.'
      }
    ]
  },
  {
    id: 'quiz-8',
    title: 'Calculus 101',
    description: 'Derivatives, integrals, and limits.',
    createdBy: 'user-5',
    category: 'Math',
    difficulty: 'Hard',
    timeLimit: 45,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    tags: ['math', 'calculus', 'university'],
    createdAt: new Date('2023-09-20').getTime(),
    attempts: 600,
    rating: 4.2,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the derivative of x^2?',
        options: ['x', '2x', 'x^3/3', '2'],
        correctAnswer: '2x',
        points: 15,
        explanation: 'Using the power rule, the derivative of x^n is n*x^(n-1). So for x^2, it is 2x.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'What is the integral of 1/x dx?',
        options: ['ln|x| + C', 'x^-2 + C', 'e^x + C', '1 + C'],
        correctAnswer: 'ln|x| + C',
        points: 15,
        explanation: 'The antiderivative of 1/x is the natural logarithm of the absolute value of x, plus a constant C.'
      }
    ]
  },
  {
    id: 'quiz-9',
    title: 'Data Structures',
    description: 'Test your knowledge of arrays, trees, and graphs.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Hard',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800',
    tags: ['cs', 'programming', 'algorithms'],
    createdAt: new Date('2023-10-05').getTime(),
    attempts: 1100,
    rating: 4.7,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 'Stack',
        points: 15,
        explanation: 'A stack operates on a Last In First Out (LIFO) principle, like a stack of plates.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctAnswer: 'O(log n)',
        points: 15,
        explanation: 'In a balanced BST, each comparison halves the search space, resulting in O(log n) time complexity.'
      }
    ]
  },
  {
    id: 'quiz-10',
    title: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and mythology.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'egypt', 'ancient'],
    createdAt: new Date('2023-10-15').getTime(),
    attempts: 1850,
    rating: 4.8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'Who was the ancient Egyptian god of the afterlife?',
        options: ['Ra', 'Anubis', 'Osiris', 'Horus'],
        correctAnswer: 'Osiris',
        points: 10,
        explanation: 'Osiris was the god of the afterlife, the underworld, and rebirth in ancient Egyptian religion.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which pharaohs tomb was discovered nearly intact in 1922?',
        options: ['Ramses II', 'Cleopatra', 'Tutankhamun', 'Akhenaten'],
        correctAnswer: 'Tutankhamun',
        points: 10,
        explanation: 'Howard Carter discovered the nearly intact tomb of King Tutankhamun in the Valley of the Kings in 1922.'
      }
    ]
  },
  {
    id: 'quiz-11',
    title: 'Periodic Table',
    description: 'Elements, atomic numbers, and chemical symbols.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Medium',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    tags: ['chemistry', 'science', 'elements'],
    createdAt: new Date('2023-11-01').getTime(),
    attempts: 2200,
    rating: 4.6,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the chemical symbol for Gold?',
        options: ['Go', 'Au', 'Ag', 'Gd'],
        correctAnswer: 'Au',
        points: 10,
        explanation: 'The symbol for Gold is Au, derived from the Latin word "aurum".'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which element has the atomic number 1?',
        options: ['Oxygen', 'Carbon', 'Helium', 'Hydrogen'],
        correctAnswer: 'Hydrogen',
        points: 10,
        explanation: 'Hydrogen is the lightest element and has an atomic number of 1.'
      }
    ]
  },
  {
    id: 'quiz-12',
    title: 'Music Theory',
    description: 'Notes, scales, and chords.',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Hard',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=800',
    tags: ['music', 'theory', 'arts'],
    createdAt: new Date('2023-11-10').getTime(),
    attempts: 950,
    rating: 4.4,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'How many notes are in a standard major scale?',
        options: ['5', '7', '8', '12'],
        correctAnswer: '7',
        points: 15,
        explanation: 'A standard major scale consists of 7 distinct notes (heptatonic) before the octave repeats.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'What is the relative minor of C Major?',
        options: ['A minor', 'E minor', 'D minor', 'G minor'],
        correctAnswer: 'A minor',
        points: 15,
        explanation: 'A minor is the relative minor of C Major, as they share the same key signature (no sharps or flats).'
      }
    ]
  },
  {
    id: 'quiz-13',
    title: 'Machine Learning Concepts',
    description: 'Neural networks, algorithms, and AI.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Hard',
    timeLimit: 35,
    coverImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800',
    tags: ['ai', 'ml', 'tech'],
    createdAt: new Date('2023-11-20').getTime(),
    attempts: 1300,
    rating: 4.8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What does CNN stand for in deep learning?',
        options: ['Computer Neural Network', 'Convolutional Neural Network', 'Complex Node Network', 'Calculated Neural Node'],
        correctAnswer: 'Convolutional Neural Network',
        points: 15,
        explanation: 'CNN stands for Convolutional Neural Network, commonly used for image processing.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which of these is an unsupervised learning algorithm?',
        options: ['Linear Regression', 'Random Forest', 'K-Means Clustering', 'Support Vector Machine'],
        correctAnswer: 'K-Means Clustering',
        points: 15,
        explanation: 'K-Means Clustering is an unsupervised learning algorithm used to group unlabeled data.'
      }
    ]
  },
  {
    id: 'quiz-14',
    title: 'Oscar Winning Movies',
    description: 'Test your knowledge of Academy Award winners.',
    createdBy: 'user-5',
    category: 'Pop Culture',
    difficulty: 'Easy',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    tags: ['movies', 'oscars', 'cinema'],
    createdAt: new Date('2023-12-01').getTime(),
    attempts: 3100,
    rating: 4.9,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'Which movie won Best Picture in 1998?',
        options: ['Good Will Hunting', 'Titanic', 'L.A. Confidential', 'As Good as It Gets'],
        correctAnswer: 'Titanic',
        points: 10,
        explanation: 'Titanic won 11 Academy Awards in 1998, including Best Picture.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Who won Best Actor for his role in "The Revenant"?',
        options: ['Tom Hardy', 'Leonardo DiCaprio', 'Brad Pitt', 'Christian Bale'],
        correctAnswer: 'Leonardo DiCaprio',
        points: 10,
        explanation: 'Leonardo DiCaprio won his first Oscar for Best Actor for his performance in The Revenant.'
      }
    ]
  },
  {
    id: 'quiz-15',
    title: 'Linear Algebra',
    description: 'Matrices, vectors, and transformations.',
    createdBy: 'user-4',
    category: 'Math',
    difficulty: 'Hard',
    timeLimit: 40,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    tags: ['math', 'algebra', 'university'],
    createdAt: new Date('2023-12-10').getTime(),
    attempts: 500,
    rating: 4.1,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the determinant of the identity matrix?',
        options: ['0', '1', '-1', 'Undefined'],
        correctAnswer: '1',
        points: 15,
        explanation: 'The determinant of any identity matrix is always 1.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'If a matrix has a determinant of 0, it is called:',
        options: ['Invertible', 'Orthogonal', 'Singular', 'Diagonal'],
        correctAnswer: 'Singular',
        points: 15,
        explanation: 'A matrix with a determinant of 0 is called a singular matrix and does not have an inverse.'
      }
    ]
  },
  {
    id: 'quiz-16',
    title: 'World War II',
    description: 'Major events and figures of WWII.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'ww2', 'war'],
    createdAt: new Date('2024-01-05').getTime(),
    attempts: 2400,
    rating: 4.7,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'In what year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: '1945',
        points: 10,
        explanation: 'World War II ended in 1945 with the surrender of Germany in May and Japan in September.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'Which country was NOT part of the Axis powers?',
        options: ['Germany', 'Italy', 'Japan', 'Soviet Union'],
        correctAnswer: 'Soviet Union',
        points: 10,
        explanation: 'The Soviet Union fought alongside the Allies against the Axis powers (Germany, Italy, Japan) after being invaded by Germany in 1941.'
      }
    ]
  },
  {
    id: 'quiz-17',
    title: 'Cybersecurity Basics',
    description: 'Protecting networks, devices, and data.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Medium',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
    tags: ['security', 'tech', 'internet'],
    createdAt: new Date('2024-01-15').getTime(),
    attempts: 1750,
    rating: 4.8,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What does Phishing refer to?',
        options: ['A type of firewall', 'Fraudulent attempts to obtain sensitive info', 'A secure encryption method', 'A computer virus'],
        correctAnswer: 'Fraudulent attempts to obtain sensitive info',
        points: 10,
        explanation: 'Phishing is a cyber attack that uses disguised email as a weapon to trick the email recipient into believing that the message is something they want or need.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'What does VPN stand for?',
        options: ['Virtual Private Network', 'Visual Processing Node', 'Verified Public Name', 'Virtual Protocol Network'],
        correctAnswer: 'Virtual Private Network',
        points: 10,
        explanation: 'A Virtual Private Network (VPN) gives you online privacy and anonymity by creating a private network from a public internet connection.'
      }
    ]
  },
  {
    id: 'quiz-18',
    title: 'General Knowledge Megamix',
    description: 'A mix of random facts from all categories.',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Easy',
    timeLimit: 15,
    coverImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800',
    tags: ['trivia', 'general', 'fun'],
    createdAt: new Date('2024-02-01').getTime(),
    attempts: 5200,
    rating: 4.9,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        image: null,
        text: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 'Pacific Ocean',
        points: 10,
        explanation: 'The Pacific Ocean is the largest and deepest of Earths oceanic divisions.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        image: null,
        text: 'How many continents are there?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '7',
        points: 10,
        explanation: 'There are generally considered to be 7 continents: Africa, Antarctica, Asia, Australia/Oceania, Europe, North America, and South America.'
      }
    ]
  },
  {
    id: 'quiz-19',
    title: 'React Hooks Masterclass',
    description: 'Master the power of functional components with this deep dive into React Hooks.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Hard',
    timeLimit: 40,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    tags: ['react', 'hooks', 'javascript'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    attempts: 3420,
    rating: 4.9,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Which hook is used for side effects in functional components?', options: ['useEffect', 'useState', 'useReducer', 'useMemo'], correctAnswer: 'useEffect', points: 10, explanation: 'useEffect allows you to perform side effects like data fetching or DOM manipulation.' },
      { id: 'q2', type: 'multiple-choice', text: 'How do you perform a cleanup in useEffect?', options: ['Call a cleanup function', 'Return a function from useEffect', 'Use a try-finally block', 'useEffect handles it automatically'], correctAnswer: 'Return a function from useEffect', points: 15, explanation: 'Returning a function from useEffect is the standard way to handle cleanup.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which hook should be used to persist values between renders without causing re-renders?', options: ['useState', 'useCallback', 'useRef', 'useLayoutEffect'], correctAnswer: 'useRef', points: 10, explanation: 'useRef returns a mutable ref object whose .current property persists across renders.' },
      { id: 'q4', type: 'short-answer', text: 'What is the hook used to optimize performance by memoizing complex calculations?', options: [], correctAnswer: 'useMemo', points: 15, explanation: 'useMemo only recomputes the memoized value when one of the dependencies has changed.' },
      { id: 'q5', type: 'multiple-choice', text: 'Can Hooks be called inside loops or conditions?', options: ['Yes, always', 'No, never', 'Only if the condition is constant', 'Only inside forEach'], correctAnswer: 'No, never', points: 10, explanation: 'Hooks must always be called at the top level of your React function.' }
    ]
  },
  {
    id: 'quiz-20',
    title: 'Quantum Physics Basics',
    description: 'Enter the subatomic world and test your knowledge of quantum mechanics.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Hard',
    timeLimit: 45,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    tags: ['physics', 'science', 'quantum'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    attempts: 1250,
    rating: 4.7,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What is the "uncertainty principle" associated with?', options: ['Einstein', 'Heisenberg', 'Bohr', 'Schrödinger'], correctAnswer: 'Heisenberg', points: 15, explanation: 'Werne Heisenberg formulated the uncertainty principle, stating we cannot know both position and momentum precisely.' },
      { id: 'q2', type: 'multiple-choice', text: 'What is the basic unit of light in quantum theory?', options: ['Electron', 'Proton', 'Photon', 'Neutron'], correctAnswer: 'Photon', points: 10, explanation: 'A photon is a quantum of electromagnetic radiation.' },
      { id: 'q3', type: 'multiple-choice', text: 'Schrödinger used which animal in his famous thought experiment?', options: ['Dog', 'Bird', 'Cat', 'Mouse'], correctAnswer: 'Cat', points: 10, explanation: 'Schrödinger’s Cat is a thought experiment that illustrates the paradox of superposition.' },
      { id: 'q4', type: 'multiple-choice', text: 'What is quantum entanglement often called?', options: ['Spooky action at a distance', 'Atomic bonding', 'Wave interference', 'Particle collision'], correctAnswer: 'Spooky action at a distance', points: 15, explanation: 'Einstein famously referred to entanglement as "spooky action at a distance."' },
      { id: 'q5', type: 'short-answer', text: 'What property describes a particle being in multiple states at once?', options: [], correctAnswer: 'Superposition', points: 20, explanation: 'Superposition is a fundamental principle of quantum mechanics where a physical system exists in all theoretical states simultaneously.' }
    ]
  },
  {
    id: 'quiz-21',
    title: 'Ancient Samurai Culture',
    description: 'The way of the warrior: history, weapons, and code of the Samurai.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'japan', 'samurai'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    attempts: 4100,
    rating: 4.8,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What was the unwritten code of moral principles followed by the samurai?', options: ['Bento', 'Bushido', 'Karate', 'Ninja'], correctAnswer: 'Bushido', points: 10, explanation: 'Bushido, "the way of the warrior," was the strict code of conduct for samurai.' },
      { id: 'q2', type: 'multiple-choice', text: 'What was the primary weapon of a samurai?', options: ['Katana', 'Longbow', 'Spear', 'Shuriken'], correctAnswer: 'Katana', points: 10, explanation: 'The katana was the iconic curved sword uniquely associated with the samurai.' },
      { id: 'q3', type: 'multiple-choice', text: 'Samurai without a master were known as:', options: ['Ninja', 'Shogun', 'Ronin', 'Daimyo'], correctAnswer: 'Ronin', points: 15, explanation: 'A ronin was a wandering samurai who had no lord or master.' },
      { id: 'q4', type: 'multiple-choice', text: 'Who was the military dictator of Japan during the samurai era?', options: ['Emperor', 'Shogun', 'Sensei', 'Samurai'], correctAnswer: 'Shogun', points: 10, explanation: 'The Shogun was the de facto ruler and military leader of feudal Japan.' },
      { id: 'q5', type: 'short-answer', text: 'What is the Japanese term for ritual suicide performed to restore honor?', options: [], correctAnswer: 'Seppuku', points: 20, explanation: 'Seppuku (also known as hara-kiri) was a form of ritual suicide by disembowelment.' }
    ]
  },
  {
    id: 'quiz-22',
    title: 'The Great French Revolution',
    description: 'Liberty, Equality, Fraternity: Explore one of history’s most turbulent eras.',
    createdBy: 'user-2',
    category: 'History',
    difficulty: 'Hard',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1572949645841-3947a60ef29a?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'france', 'revolution'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    attempts: 2800,
    rating: 4.6,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'In which year did the French Revolution begin?', options: ['1776', '1789', '1793', '1804'], correctAnswer: '1789', points: 10, explanation: 'The revolution began in 1789 with the storming of the Bastille.' },
      { id: 'q2', type: 'multiple-choice', text: 'Who was the King of France at the start of the Revolution?', options: ['Louis XIV', 'Louis XV', 'Louis XVI', 'Napoleon'], correctAnswer: 'Louis XVI', points: 10, explanation: 'Louis XVI was the last King of France before the fall of the monarchy.' },
      { id: 'q3', type: 'multiple-choice', text: 'What prison was stormed on July 14, 1789?', options: ['Versailles', 'The Louvre', 'The Bastille', 'Newgate'], correctAnswer: 'The Bastille', points: 15, explanation: 'The storming of the Bastille is considered the flashpoint of the revolution.' },
      { id: 'q4', type: 'multiple-choice', text: 'The period of mass executions during the revolution was called:', options: ['The Great War', 'The Age of Reason', 'The Reign of Terror', 'The Napoleonic Era'], correctAnswer: 'The Reign of Terror', points: 15, explanation: 'The Reign of Terror saw thousands executed by the guillotine.' },
      { id: 'q5', type: 'short-answer', text: 'Who rose to power as Emperor at the end of the Revolution?', options: [], correctAnswer: 'Napoleon Bonaparte', points: 10, explanation: 'Napoleon Bonaparte seized power in a coup and eventually became Emperor of the French.' }
    ]
  },
  {
    id: 'quiz-23',
    title: 'Anime Legends & Lore',
    description: 'Test your knowledge on the greatest anime series of all time.',
    createdBy: 'user-5',
    category: 'Pop Culture',
    difficulty: 'Easy',
    timeLimit: 20,
    coverImage: 'https://images.unsplash.com/photo-1578632738980-43314a796444?auto=format&fit=crop&q=80&w=800',
    tags: ['anime', 'manga', 'japan'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    attempts: 9800,
    rating: 5.0,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Who is the protagonist of "One Piece"?', options: ['Naruto Uzumaki', 'Goku', 'Monkey D. Luffy', 'Ichigo Kurosaki'], correctAnswer: 'Monkey D. Luffy', points: 10, explanation: 'Luffy is the captain of the Straw Hat Pirates and main character of One Piece.' },
      { id: 'q2', type: 'multiple-choice', text: 'What is the name of the notebook in "Death Note"?', options: ['The Killing Book', 'Shinigami Note', 'Death Note', 'Fate Book'], correctAnswer: 'Death Note', points: 10, explanation: 'The notebook eponymous with the series is the Death Note.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which studio produced "Spirited Away"?', options: ['Toei Animation', 'Studio Ghibli', 'Madhouse', 'MAPPA'], correctAnswer: 'Studio Ghibli', points: 15, explanation: 'Studio Ghibli, led by Hayao Miyazaki, produced the Oscar-winning Spirited Away.' },
      { id: 'q4', type: 'short-answer', text: 'What is the energy source used in the "Naruto" series?', options: [], correctAnswer: 'Chakra', points: 10, explanation: 'Chakra is the essential energy used by ninjas in Naruto.' },
      { id: 'q5', type: 'multiple-choice', text: 'What is Gokus signature move in "Dragon Ball"?', options: ['Rasengan', 'Kamehameha', 'Chidori', 'Spirit Bomb'], correctAnswer: 'Kamehameha', points: 10, explanation: 'The Kamehameha is Gokus most iconic energy attack.' }
    ]
  },
  {
    id: 'quiz-24',
    title: 'Cyber Defense 101',
    description: 'Learn the essentials of defending against cyber attacks and securing data.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tags: ['cybersecurity', 'tech', 'security'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    attempts: 1950,
    rating: 4.8,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What does "DDoS" stand for?', options: ['Direct Disk Operating System', 'Distributed Denial of Service', 'Dedicated Data of System', 'Distributed Disk of Security'], correctAnswer: 'Distributed Denial of Service', points: 15, explanation: 'DDoS attacks overwhelm a target with traffic from multiple sources.' },
      { id: 'q2', type: 'multiple-choice', text: 'Which of these is a common method for two-factor authentication (2FA)?', options: ['Username', 'SMS code', 'Password', 'Email address'], correctAnswer: 'SMS code', points: 10, explanation: 'SMS codes are a common second factor for securing logins.' },
      { id: 'q3', type: 'multiple-choice', text: 'What is "social engineering"?', options: ['Manipulating people to gain access', 'Coding a social media app', 'Testing network hardware', 'Encryption software'], correctAnswer: 'Manipulating people to gain access', points: 15, explanation: 'Social engineering relies on psychological manipulation rather than technical hacking.' },
      { id: 'q4', type: 'short-answer', text: 'What is the term for a program that replicates itself to spread to other computers?', options: [], correctAnswer: 'Worm', points: 15, explanation: 'A computer worm is a standalone malware computer program that replicates itself in order to spread to other computers.' },
      { id: 'q5', type: 'multiple-choice', text: 'What is "brute force"?', options: ['Guessing every possible password', 'Using a heavy magnet on a HDD', 'Physical theft of a laptop', 'A powerful new firewall'], correctAnswer: 'Guessing every possible password', points: 10, explanation: 'Brute force attacks involve trying every combination until the correct one is found.' }
    ]
  },
  {
    id: 'quiz-25',
    title: 'Deep Sea Mysteries',
    description: 'Explore the uncharted depths of Earth’s oceans and their strange inhabitants.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=800',
    tags: ['ocean', 'science', 'nature'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    attempts: 3200,
    rating: 4.9,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What is the deepest known part of the ocean?', options: ['Puerto Rico Trench', 'Mariana Trench', 'Java Trench', 'Eurasian Basin'], correctAnswer: 'Mariana Trench', points: 15, explanation: 'The Challenger Deep in the Mariana Trench is the deepest part of the ocean.' },
      { id: 'q2', type: 'multiple-choice', text: 'What property allows deep-sea creatures to glow?', options: ['Photosynthesis', 'Bioluminescence', 'Radioactivity', 'Fluorescence'], correctAnswer: 'Bioluminescence', points: 10, explanation: 'Bioluminescence is the production and emission of light by a living organism.' },
      { id: 'q3', type: 'multiple-choice', text: 'What type of whale is the largest animal ever known?', options: ['Gray Whale', 'Blue Whale', 'Fin Whale', 'Humpback Whale'], correctAnswer: 'Blue Whale', points: 10, explanation: 'The Blue Whale can reach lengths of over 100 feet and weigh up to 200 tons.' },
      { id: 'q4', type: 'multiple-choice', text: 'Hydrothermal vents on the ocean floor are often called:', options: ['Sea plumes', 'Black smokers', 'Deep geysers', 'Salt domes'], correctAnswer: 'Black smokers', points: 15, explanation: 'Hydrothermal vents are often called black smokers due to the dark, mineral-rich fluid they emit.' },
      { id: 'q5', type: 'short-answer', text: 'What is the name for the zone in the ocean where there is no sunlight?', options: [], correctAnswer: 'Aphotic Zone', points: 20, explanation: 'The aphotic zone is the portion of a lake or ocean where there is little or no sunlight.' }
    ]
  },
  {
    id: 'quiz-26',
    title: 'The Cold War Era',
    description: 'A global struggle for ideological dominance between superpowers.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1547483302-61011342687a?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'coldwar', 'world'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    attempts: 2100,
    rating: 4.5,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'The Cold War was primarily a rivalry between which two nations?', options: ['USA and Germany', 'USA and USSR', 'UK and France', 'China and Japan'], correctAnswer: 'USA and USSR', points: 10, explanation: 'The struggle was between the capitalist USA and the communist Soviet Union.' },
      { id: 'q2', type: 'multiple-choice', text: 'What 1962 crisis brought the world closest to nuclear war?', options: ['Berlin Blockade', 'Korean War', 'Cuban Missile Crisis', 'Vietnam War'], correctAnswer: 'Cuban Missile Crisis', points: 15, explanation: 'The confrontation in Cuba was the peak of Cold War tensions.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which defense alliance was formed by Western nations in 1949?', options: ['Warsaw Pact', 'League of Nations', 'NATO', 'EU'], correctAnswer: 'NATO', points: 10, explanation: 'NATO was formed to provide collective security against Soviet influence.' },
      { id: 'q4', type: 'multiple-choice', text: 'What term did Winston Churchill use for the boundary in Europe?', options: ['The Great Wall', 'The Iron Curtain', 'The Steel Belt', 'The Red Line'], correctAnswer: 'The Iron Curtain', points: 10, explanation: 'The "Iron Curtain" symbolized the divide between Western Europe and the Eastern Bloc.' },
      { id: 'q5', type: 'short-answer', text: 'In which city was a wall built to prevent East Germans from fleeing?', options: [], correctAnswer: 'Berlin', points: 10, explanation: 'The Berlin Wall was the most iconic physical manifestation of the Cold War.' }
    ]
  },
  {
    id: 'quiz-27',
    title: 'Gaming History & Evolution',
    description: 'From Pong to PS5: How video games changed the world.',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    tags: ['gaming', 'history', 'tech'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    attempts: 6500,
    rating: 4.8,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What was the first commercially successful video game?', options: ['Space Invaders', 'Pac-Man', 'Pong', 'Tetris'], correctAnswer: 'Pong', points: 10, explanation: 'Atari\'s Pong was the first true commercial gaming success.' },
      { id: 'q2', type: 'multiple-choice', text: 'Which company produced the Game Boy?', options: ['Sony', 'Sega', 'Nintendo', 'Microsoft'], correctAnswer: 'Nintendo', points: 10, explanation: 'The Game Boy was Nintendo\'s legendary handheld console released in 1989.' },
      { id: 'q3', type: 'multiple-choice', text: 'In "The Legend of Zelda", what is the name of the protagonist?', options: ['Zelda', 'Link', 'Ganondorf', 'Epona'], correctAnswer: 'Link', points: 10, explanation: 'Link is the main playable character; Zelda is the princess.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which game features the phrase "Finish Him!"?', options: ['Street Fighter', 'Tekken', 'Mortal Kombat', 'Super Smash Bros'], correctAnswer: 'Mortal Kombat', points: 10, explanation: 'Fatality sequences in Mortal Kombat are preceded by this iconic phrase.' },
      { id: 'q5', type: 'short-answer', text: 'What is the best-selling video game of all time (as of 2024)?', options: [], correctAnswer: 'Minecraft', points: 15, explanation: 'Minecraft has sold over 300 million copies across all platforms.' }
    ]
  },
  {
    id: 'quiz-28',
    title: 'React Native for Mobile',
    description: 'Build native mobile apps with JavaScript and React.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
    tags: ['reactnative', 'mobile', 'javascript'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    attempts: 2450,
    rating: 4.7,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Which component is used as the root for every screen in React Native?', options: ['div', 'View', 'Box', 'Section'], correctAnswer: 'View', points: 10, explanation: 'The <View> component is the fundamental building block of React Native UIs.' },
      { id: 'q2', type: 'multiple-choice', text: 'Which tool allows you to run React Native apps without setting up Xcode/Android Studio?', options: ['NPM', 'Expo', 'Webpack', 'Babel'], correctAnswer: 'Expo', points: 15, explanation: 'Expo is a framework and platform for universal React applications.' },
      { id: 'q3', type: 'multiple-choice', text: 'How do you apply styles in React Native?', options: ['CSS files', 'Inline CSS', 'StyleSheet API', 'SASS'], correctAnswer: 'StyleSheet API', points: 10, explanation: 'StyleSheet.create() is the standard way to define styles in RN.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which hook provides access to device dimensions?', options: ['useWindowDimensions', 'useScreenSize', 'useDeviceUI', 'useLayout'], correctAnswer: 'useWindowDimensions', points: 15, explanation: 'useWindowDimensions provides real-time updates of dimensions.' },
      { id: 'q5', type: 'short-answer', text: 'What is the core command to create a new React Native app with CLI?', options: [], correctAnswer: 'npx react-native init', points: 15, explanation: 'This command initializes a new React Native project.' }
    ]
  },
  {
    id: 'quiz-29',
    title: 'Human Genetics Unlocked',
    description: 'DNA, inheritance, and the blueprint of life.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    tags: ['dna', 'genetics', 'science'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    attempts: 1800,
    rating: 4.6,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Who is known as the father of modern genetics?', options: ['Charles Darwin', 'Gregor Mendel', 'James Watson', 'Francis Crick'], correctAnswer: 'Gregor Mendel', points: 10, explanation: 'Mendel discovered the basic principles of heredity through pea plant experiments.' },
      { id: 'q2', type: 'multiple-choice', text: 'How many chromosomes do typical human cells have?', options: ['23', '44', '46', '48'], correctAnswer: '46', points: 10, explanation: 'Humans have 46 chromosomes (23 pairs) in somatic cells.' },
      { id: 'q3', type: 'multiple-choice', text: 'What is the double-helix molecule that contains genetic instructions?', options: ['RNA', 'Protein', 'DNA', 'ATP'], correctAnswer: 'DNA', points: 10, explanation: 'DNA (Deoxyribonucleic acid) is the genetic code carrier.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which sugar is found in DNA?', options: ['Glucose', 'Ribose', 'Deoxyribose', 'Fructose'], correctAnswer: 'Deoxyribose', points: 15, explanation: 'DNA contains the sugar deoxyribose, whereas RNA contains ribose.' },
      { id: 'q5', type: 'short-answer', text: 'What is the process by which DNA makes a copy of itself?', options: [], correctAnswer: 'Replication', points: 15, explanation: 'DNA replication is the biological process of producing two identical replicas of DNA.' }
    ]
  },
  {
    id: 'quiz-30',
    title: 'The Industrial Revolution',
    description: 'How steam, steel, and machinery transformed society.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'tech', 'economics'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    attempts: 1400,
    rating: 4.4,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'In which country did the Industrial Revolution begin?', options: ['France', 'USA', 'Great Britain', 'Germany'], correctAnswer: 'Great Britain', points: 10, explanation: 'The movement began in mid-18th century Britain.' },
      { id: 'q2', type: 'multiple-choice', text: 'Who improved the steam engine, sparking rapid growth?', options: ['James Watt', 'Eli Whitney', 'Thomas Edison', 'Henry Ford'], correctAnswer: 'James Watt', points: 15, explanation: 'James Watt’s improvements to the steam engine were crucial to industrialization.' },
      { id: 'q3', type: 'multiple-choice', text: 'What was a major invention in the textile industry?', options: ['Cotton Gin', 'Spinning Jenny', 'Steam Shovel', 'Telegraph'], correctAnswer: 'Spinning Jenny', points: 15, explanation: 'The Spinning Jenny allowed workers to spin multiple threads at once.' },
      { id: 'q4', type: 'multiple-choice', text: 'What fuel source powered the first phase of the revolution?', options: ['Wood', 'Oil', 'Coal', 'Gas'], correctAnswer: 'Coal', points: 10, explanation: 'Coal was the primary fuel for steam engines and factories.' },
      { id: 'q5', type: 'short-answer', text: 'What is the term for people moving from farms to cities for factory work?', options: [], correctAnswer: 'Urbanization', points: 10, explanation: 'Urbanization was a hallmark social change of the industrial era.' }
    ]
  },
  {
    id: 'quiz-31',
    title: 'Hollywood Cinema Gems',
    description: 'The definitive quiz for movie buffs: classics, directors, and stars.',
    createdBy: 'user-5',
    category: 'Pop Culture',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    tags: ['movies', 'hollywood', 'trivia'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    attempts: 4800,
    rating: 4.9,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Who directed the 1975 thriller "Jaws"?', options: ['George Lucas', 'Steven Spielberg', 'Martin Scorsese', 'Francis Ford Coppola'], correctAnswer: 'Steven Spielberg', points: 10, explanation: 'Spielberg directed Jaws, often cited as the first "blockbuster."' },
      { id: 'q2', type: 'multiple-choice', text: 'Which movie features the line "Here’s looking at you, kid"?', options: ['Gone with the Wind', 'Casablanca', 'Citizen Kane', 'The Godfather'], correctAnswer: 'Casablanca', points: 15, explanation: 'Humphrey Bogart says this famous line in the 1942 classic Casablanca.' },
      { id: 'q3', type: 'multiple-choice', text: 'What was the first feature-length animated movie?', options: ['Bambi', 'Pinocchio', 'Snow White and the Seven Dwarfs', 'Dumbo'], correctAnswer: 'Snow White and the Seven Dwarfs', points: 10, explanation: 'Disney released Snow White in 1937 as the first full-length animated film.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which actor played Jack in the movie "Titanic"?', options: ['Tom Cruise', 'Brad Pitt', 'Leonardo DiCaprio', 'Johnny Depp'], correctAnswer: 'Leonardo DiCaprio', points: 10, explanation: 'DiCaprio’s role as Jack Dawson catapulted him to international superstardom.' },
      { id: 'q5', type: 'short-answer', text: 'What is the name of the golden award given by the AMPAS?', options: [], correctAnswer: 'Oscar', points: 10, explanation: 'The Academy Award is colloquially known as the Oscar.' }
    ]
  },
  {
    id: 'quiz-32',
    title: 'Social Media Trends',
    description: 'From hashtags to viral dances: Know your digital landscape.',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Easy',
    timeLimit: 15,
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    tags: ['socialmedia', 'internet', 'culture'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    attempts: 7200,
    rating: 4.7,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Which platform popularised short-form vertical video first?', options: ['Instagram', 'Snapchat', 'TikTok', 'Vine'], correctAnswer: 'Vine', points: 10, explanation: 'Vine (by Twitter) was the pioneer of short, looping video content.' },
      { id: 'q2', type: 'multiple-choice', text: 'What is the character limit for a standard X (formerly Twitter) post?', options: ['140', '280', '500', 'No limit'], correctAnswer: '280', points: 10, explanation: 'Twitter doubled its limit from 140 to 280 characters in 2017.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which app is primarily focused on professional networking?', options: ['Facebook', 'Reddit', 'LinkedIn', 'Pinterest'], correctAnswer: 'LinkedIn', points: 10, explanation: 'LinkedIn is the world\'s largest professional network.' },
      { id: 'q4', type: 'multiple-choice', text: 'Who is the most followed person on Instagram as of 2024?', options: ['Leo Messi', 'Kylie Jenner', 'Cristiano Ronaldo', 'Selena Gomez'], correctAnswer: 'Cristiano Ronaldo', points: 10, explanation: 'Ronaldo consistently holds the top spot for followers.' },
      { id: 'q5', type: 'short-answer', text: 'What is the name of the Facebook-owned messaging platform used globally?', options: [], correctAnswer: 'WhatsApp', points: 10, explanation: 'WhatsApp is one of the most popular global messaging apps.' }
    ]
  },
  {
    id: 'quiz-33',
    title: 'Indian Independence Movement',
    description: 'The heroic struggle for freedom from British rule.',
    createdBy: 'user-3',
    category: 'History',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800',
    tags: ['history', 'india', 'freedom'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    attempts: 1650,
    rating: 4.9,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'In which year did India gain independence?', options: ['1942', '1945', '1947', '1950'], correctAnswer: '1947', points: 10, explanation: 'India became independent on August 15, 1947.' },
      { id: 'q2', type: 'multiple-choice', text: 'Who is known as the "Father of the Nation" in India?', options: ['Jawaharlal Nehru', 'B.R. Ambedkar', 'Sardar Patel', 'Mahatma Gandhi'], correctAnswer: 'Mahatma Gandhi', points: 10, explanation: 'Mahatma Gandhi led the non-violent freedom struggle.' },
      { id: 'q3', type: 'multiple-choice', text: 'What was the 1930 protest against the salt tax called?', options: ['Civil Disobedience', 'Quit India', 'Non-Cooperation', 'Dandi March'], correctAnswer: 'Dandi March', points: 15, explanation: 'Gandhiji led the 240-mile Dandi March to defy the Salt Law.' },
      { id: 'q4', type: 'multiple-choice', text: 'Who was the first Prime Minister of independent India?', options: ['Rajendra Prasad', 'Jawaharlal Nehru', 'Indira Gandhi', 'Lal Bahadur Shastri'], correctAnswer: 'Jawaharlal Nehru', points: 10, explanation: 'Nehru served as the first PM from 1947 to 1964.' },
      { id: 'q5', type: 'short-answer', text: 'Who gave the slogan "Give me blood, and I shall give you freedom"?', options: [], correctAnswer: 'Subhas Chandra Bose', points: 15, explanation: 'Netaji Subhas Chandra Bose made this famous rallying call.' }
    ]
  },
  {
    id: 'quiz-34',
    title: 'AI Ethics & The Future',
    description: 'Exploring the moral implications of Artificial Intelligence.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Medium',
    timeLimit: 35,
    coverImage: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=800',
    tags: ['ai', 'ethics', 'future'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
    attempts: 2100,
    rating: 4.6,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What is "algorithmic bias"?', options: ['Efficiency of code', 'Systematic unfairness in AI results', 'A bug in Python', 'Fast data processing'], correctAnswer: 'Systematic unfairness in AI results', points: 15, explanation: 'Bias occurs when AI models reflect human prejudices present in training data.' },
      { id: 'q2', type: 'multiple-choice', text: 'Who formulated the "Three Laws of Robotics"?', options: ['Elon Musk', 'Alan Turing', 'Isaac Asimov', 'Bill Gates'], correctAnswer: 'Isaac Asimov', points: 10, explanation: 'Asimov introduced these laws in his science fiction stories.' },
      { id: 'q3', type: 'multiple-choice', text: 'The "Turing Test" is designed to measure:', options: ['Processing speed', 'Memory capacity', 'Human-like intelligence', 'Battery life'], correctAnswer: 'Human-like intelligence', points: 10, explanation: 'The test evaluates if a machine can exhibit intelligent behavior indistinguishable from a human.' },
      { id: 'q4', type: 'short-answer', text: 'What is the term for AI that can perform any intellectual task a human can?', options: [], correctAnswer: 'AGI', points: 20, explanation: 'Artificial General Intelligence (AGI) is the theoretical goal of AI research.' },
      { id: 'q5', type: 'multiple-choice', text: 'What is a "deepfake"?', options: ['A large database', 'AI-generated realistic media', 'A complex spreadsheet', 'A type of safe encryption'], correctAnswer: 'AI-generated realistic media', points: 15, explanation: 'Deepfakes use AI to replace a person\'s likeness in video or audio.' }
    ]
  },
  {
    id: 'quiz-35',
    title: 'DevOps Essentials',
    description: 'Bridge the gap between development and operations.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Hard',
    timeLimit: 40,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    tags: ['devops', 'cloud', 'deployment'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    attempts: 1600,
    rating: 4.7,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'What does CI/CD stand for?', options: ['Continuous Input / Clear Data', 'Constant Info / Cloud Delivery', 'Continuous Integration / Continuous Deployment', 'Code Integration / Code Delivery'], correctAnswer: 'Continuous Integration / Continuous Deployment', points: 15, explanation: 'CI/CD practices automate the stages of app delivery.' },
      { id: 'q2', type: 'multiple-choice', text: 'Which tool is most commonly used for containerization?', options: ['Jenkins', 'Docker', 'Ansible', 'Git'], correctAnswer: 'Docker', points: 10, explanation: 'Docker is the industry standard for creating and managing containers.' },
      { id: 'q3', type: 'multiple-choice', text: 'The practice of managing infrastructure through code is called:', options: ['IaC', 'PaaS', 'SaaS', 'IaaS'], correctAnswer: 'IaC', points: 15, explanation: 'Infrastructure as Code (IaC) allows for consistent and repeatable setup.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which tool is primarily used for container orchestration?', options: ['GitLab', 'Kubernetes', 'Nginx', 'Vagrant'], correctAnswer: 'Kubernetes', points: 15, explanation: 'Kubernetes (K8s) automates deployment, scaling, and management of containers.' },
      { id: 'q5', type: 'short-answer', text: 'What is the most popular distributed version control system?', options: [], correctAnswer: 'Git', points: 10, explanation: 'Git is used by millions of developers for source code management.' }
    ]
  },
  {
    id: 'quiz-36',
    title: 'Modern Human Anatomy',
    description: 'Test your knowledge of the systems and structures of the human body.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Medium',
    timeLimit: 30,
    coverImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800',
    tags: ['biology', 'science', 'body'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    attempts: 2500,
    rating: 4.8,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'How many bones are in the adult human body?', options: ['200', '206', '210', '250'], correctAnswer: '206', points: 10, explanation: 'An average adult human has 206 bones.' },
      { id: 'q2', type: 'multiple-choice', text: 'What is the largest organ of the human body?', options: ['Heart', 'Liver', 'Skin', 'Brain'], correctAnswer: 'Skin', points: 10, explanation: 'The skin is the largest organ by surface area and weight.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which part of the brain controls balance and coordination?', options: ['Cerebrum', 'Cerebellum', 'Brainstem', 'Thalamus'], correctAnswer: 'Cerebellum', points: 15, explanation: 'The cerebellum at the back of the brain coordinates movement.' },
      { id: 'q4', type: 'multiple-choice', text: 'Which blood cells carry oxygen?', options: ['White blood cells', 'Platelets', 'Red blood cells', 'Plasma'], correctAnswer: 'Red blood cells', points: 10, explanation: 'Red blood cells contain hemoglobin, which binds to oxygen.' },
      { id: 'q5', type: 'short-answer', text: 'What is the master gland of the endocrine system?', options: [], correctAnswer: 'Pituitary Gland', points: 15, explanation: 'The pituitary gland regulates many of the other endocrine glands.' }
    ]
  },
  {
    id: 'quiz-37',
    title: '90s Grunge Music',
    description: 'Return to Seattle in the 90s: Nirvana, Pearl Jam, and Soundgarden.',
    createdBy: 'user-2',
    category: 'Pop Culture',
    difficulty: 'Medium',
    timeLimit: 25,
    coverImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800',
    tags: ['music', '90s', 'rock'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
    attempts: 3900,
    rating: 4.6,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Who was the lead singer of Nirvana?', options: ['Eddie Vedder', 'Chris Cornell', 'Kurt Cobain', 'Dave Grohl'], correctAnswer: 'Kurt Cobain', points: 10, explanation: 'Cobain was the frontman and primary songwriter of Nirvana.' },
      { id: 'q2', type: 'multiple-choice', text: 'Which city is the birthplace of the Grunge movement?', options: ['Los Angeles', 'New York', 'Seattle', 'Chicago'], correctAnswer: 'Seattle', points: 10, explanation: 'Seattle, Washington was the epicenter of the grunge explosion.' },
      { id: 'q3', type: 'multiple-choice', text: 'What was the title of Nirvana’s breakout 1991 album?', options: ['In Utero', 'Bleach', 'Nevermind', 'Ten'], correctAnswer: 'Nevermind', points: 10, explanation: 'Nevermind brought alternative rock into the mainstream.' },
      { id: 'q4', type: 'multiple-choice', text: 'Who wrote the song "Black Hole Sun"?', options: ['Pearl Jam', 'Soundgarden', 'Alice in Chains', 'Nirvana'], correctAnswer: 'Soundgarden', points: 15, explanation: 'Soundgarden released Black Hole Sun in 1994.' },
      { id: 'q5', type: 'short-answer', text: 'Who was the lead singer of Pearl Jam?', options: [], correctAnswer: 'Eddie Vedder', points: 10, explanation: 'Eddie Vedder is the iconic lead vocalist of Pearl Jam.' }
    ]
  },
  {
    id: 'quiz-38',
    title: 'Physics Wonders',
    description: 'Explore the laws that govern our universe.',
    createdBy: 'user-4',
    category: 'Science',
    difficulty: 'Hard',
    timeLimit: 35,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    tags: ['science', 'physics', 'forces'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    attempts: 1350,
    rating: 4.5,
    questions: [
      { id: 'q1', type: 'multiple-choice', text: 'Who formulated the three laws of motion?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'], correctAnswer: 'Isaac Newton', points: 10, explanation: 'Newton’s Principia Mathematica detailed the laws of motion and gravity.' },
      { id: 'q2', type: 'multiple-choice', text: 'What is the speed of light in a vacuum?', options: ['~300,000 km/s', '~150,000 km/s', '~1,000,000 km/s', 'Infinite'], correctAnswer: '~300,000 km/s', points: 15, explanation: 'Light travels at approximately 299,792,458 meters per second.' },
      { id: 'q3', type: 'multiple-choice', text: 'Which force keeps planets in orbit around the sun?', options: ['Magnetism', 'Friction', 'Gravity', 'Electricity'], correctAnswer: 'Gravity', points: 10, explanation: 'Gravity is the universal force of attraction between masses.' },
      { id: 'q4', type: 'multiple-choice', text: 'What does E=mc^2 stand for?', options: ['Energy = mass x speed of light squared', 'Electricity = motion x current', 'Energy = momentum x constant', 'Equivalent = mass x carbon'], correctAnswer: 'Energy = mass x speed of light squared', points: 15, explanation: 'Einstein’s mass-energy equivalence formula is one of physics’ most famous.' },
      { id: 'q5', type: 'short-answer', text: 'What is the standard unit of force?', options: [], correctAnswer: 'Newton', points: 10, explanation: 'The Newton (N) is the SI unit of force.' }
    ]
  },
  {
    id: 'quiz-39',
    title: 'Quantum Mechanics in Computing',
    description: 'Master the fundamental principles of quantum mechanics as they apply to next-generation computing systems.',
    createdBy: 'user-1',
    category: 'Tech',
    difficulty: 'Hard',
    timeLimit: 45,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    tags: ['quantum', 'computing', 'physics', 'cs'],
    createdAt: Date.now(),
    attempts: 0,
    rating: 0,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Which quantum property allows a qubit to exist in multiple states simultaneously?',
        options: ['Entanglement', 'Superposition', 'Interference', 'Tunneling'],
        correctAnswer: 'Superposition',
        points: 20,
        explanation: 'Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        text: 'What is the phenomenon where two quantum particles become linked, regardless of distance?',
        options: ['Decoherence', 'Superposition', 'Entanglement', 'Quantization'],
        correctAnswer: 'Entanglement',
        points: 20,
        explanation: 'Entanglement is a physical phenomenon that occurs when a pair or group of particles is generated, interact, or share spatial proximity in a way such that the quantum state of each particle cannot be described independently of the state of the others.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        text: 'Which quantum gate is the equivalent of a NOT gate in classical computing?',
        options: ['Hadamard Gate', 'Pauli-X Gate', 'Pauli-Z Gate', 'CNOT Gate'],
        correctAnswer: 'Pauli-X Gate',
        points: 20,
        explanation: 'The Pauli-X gate acts on a single qubit and is the quantum equivalent of the NOT gate (flips |0> to |1> and vice versa).'
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        text: 'What term describes the loss of quantum information to the surrounding environment?',
        options: ['Decoherence', 'Interference', 'Measurement Error', 'Quantum Noise'],
        correctAnswer: 'Decoherence',
        points: 20,
        explanation: 'Quantum decoherence is the loss of quantum coherence, which is the process by which a quantum system loses its "quantumness" by interacting with its environment.'
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        text: 'Which algorithm demonstrated that quantum computers could factor large integers exponentially faster than classical algorithms?',
        options: ["Grover's Algorithm", "Shor's Algorithm", "Deutsch-Jozsa Algorithm", "VQE"],
        correctAnswer: "Shor's Algorithm",
        points: 20,
        explanation: "Shor's algorithm, formulated by Peter Shor in 1994, is a quantum algorithm for integer factorization."
      }
    ]
  }
];

export const seedScores: Score[] = [
  {
    id: 'score-1',
    userId: 'user-1',
    quizId: 'quiz-1',
    score: 30,
    totalPoints: 35,
    timeTaken: 45,
    answers: { 'q1': '"object"', 'q2': 'pop()', 'q3': 'A function bundled together with its lexical environment' },
    answeredAt: new Date('2023-06-02').getTime(),
  },
  {
    id: 'score-2',
    userId: 'user-2',
    quizId: 'quiz-1',
    score: 20,
    totalPoints: 35,
    timeTaken: 60,
    answers: { 'q1': '"object"', 'q2': 'shift()', 'q3': 'A function bundled together with its lexical environment' },
    answeredAt: new Date('2023-06-05').getTime(),
  },
  {
    id: 'score-3',
    userId: 'user-3',
    quizId: 'quiz-2',
    score: 25,
    totalPoints: 25,
    timeTaken: 30,
    answers: { 'q1': '1989', 'q2': 'Augustus' },
    answeredAt: new Date('2023-06-16').getTime(),
  },
  {
    id: 'score-4',
    userId: 'user-4',
    quizId: 'quiz-3',
    score: 20,
    totalPoints: 20,
    timeTaken: 20,
    answers: { 'q1': 'Mars', 'q2': 'Yuri Gagarin' },
    answeredAt: new Date('2023-07-03').getTime(),
  },
  {
    id: 'score-5',
    userId: 'user-1',
    quizId: 'quiz-4',
    score: 60,
    totalPoints: 60,
    timeTaken: 40,
    answers: { 'q1': 'Mitochondria', 'q2': 'DNA storage', 'q3': 'Anaphase' },
    answeredAt: new Date('2023-08-11').getTime(),
  }
];
