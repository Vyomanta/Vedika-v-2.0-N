


export const DEFAULT_QUIZZES = [
  {
    id: 'quiz-physics-mechanics',
    title: 'Kinematics & Newton\'s Laws Quiz',
    course: 'physics-mechanics-fundamentals',
    courseTitle: 'Physics: Mechanics & Energy',
    lesson: 'phys_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'What is Newton\'s Second Law of Motion?', options: ['F = m / a', 'F = m · a', 'E = mc²', 'W = F · d'], correct: 1 },
      { question: 'If an object moves with constant velocity, what is its net acceleration?', options: ['9.8 m/s²', '0 m/s²', 'Variable', 'Infinite'], correct: 1 }
    ]
  },
  {
    id: 'quiz-calculus-derivatives',
    title: 'Limits & Differential Calculus Quiz',
    course: 'calculus-advanced-mathematics',
    courseTitle: 'Mathematics: Calculus & Analysis',
    lesson: 'math_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'What is the derivative of f(x) = x³ with respect to x?', options: ['3x', '3x²', 'x²', '3x³'], correct: 1 },
      { question: 'Geometrically, what does the first derivative f\'(x) represent?', options: ['The area under the curve', 'The slope of the tangent line', 'The x-intercept', 'The function volume'], correct: 1 }
    ]
  },
  {
    id: 'quiz-chemistry-bonding',
    title: 'Atomic Structure & Chemical Bonding Quiz',
    course: 'general-physical-chemistry',
    courseTitle: 'Chemistry: Atoms, Bonds & Reactions',
    lesson: 'chem_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'What type of bond forms when electrons are shared between two nonmetals?', options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'], correct: 1 },
      { question: 'What is the maximum number of electrons an s-orbital can hold?', options: ['2', '6', '10', '14'], correct: 0 }
    ]
  },
  {
    id: 'quiz-biology-cell',
    title: 'Cell Organelles & Respiration Quiz',
    course: 'cellular-biology-genetics',
    courseTitle: 'Biology: Cells & Molecular Genetics',
    lesson: 'bio_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'Which organelle is considered the powerhouse of eukaryotic cells?', options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'], correct: 1 },
      { question: 'What molecule carries genetic instructions for building proteins?', options: ['Lipids', 'DNA', 'Glucose', 'Hemoglobin'], correct: 1 }
    ]
  },
  {
    id: 'quiz-python-intro',
    title: 'Python Syntax & Variables Quiz',
    course: 'python-programming-essentials',
    courseTitle: 'Python Programming Essentials',
    lesson: 'py_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'Which keyword is used to define a function in Python?', options: ['func', 'define', 'def', 'function'], correct: 2 },
      { question: 'What is the output of type(10.5)?', options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'double\'>'], correct: 1 }
    ]
  },
  {
    id: 'quiz-web-html-css',
    title: 'HTML & CSS Fundamentals Quiz',
    course: 'modern-web-development-html-css',
    courseTitle: 'Web Development: HTML & CSS',
    lesson: 'web_l2',
    max_attempts: 3,
    passing_percentage: 75,
    total_marks: 10,
    duration: '10 mins',
    questions: [
      { question: 'Which HTML5 element represents the primary navigation links of a page?', options: ['<header>', '<nav>', '<section>', '<aside>'], correct: 1 },
      { question: 'In the CSS box model, which layer sits between padding and margin?', options: ['Content', 'Border', 'Outline', 'Shadow'], correct: 1 }
    ]
  }
];

export function getAssignmentMetadata(assId) {
  if (typeof window === 'undefined') return {};
  try {
    const store = JSON.parse(localStorage.getItem('assignment_criteria_store') || '{}');
    return store[assId] || {};
  } catch (e) { return {}; }
}

export function setAssignmentMetadata(assId, meta) {
  if (typeof window === 'undefined') return;
  try {
    const store = JSON.parse(localStorage.getItem('assignment_criteria_store') || '{}');
    store[assId] = { ...(store[assId] || {}), ...meta };
    localStorage.setItem('assignment_criteria_store', JSON.stringify(store));
  } catch (e) {}
}

export function getStoredAiEval(subId) {
  if (typeof window === 'undefined') return null;
  try {
    const store = JSON.parse(localStorage.getItem('submission_ai_store') || '{}');
    return store[subId] || null;
  } catch (e) { return null; }
}

export function setStoredAiEval(subId, score, aiEval) {
  if (typeof window === 'undefined') return;
  try {
    const store = JSON.parse(localStorage.getItem('submission_ai_store') || '{}');
    store[subId] = { score, ai_evaluation: aiEval };
    localStorage.setItem('submission_ai_store', JSON.stringify(store));
  } catch (e) {}
}

export const DEFAULT_ASSIGNMENTS = [
  {
    id: 'assign-physics-mechanics',
    title: 'Kinematic Trajectory & Forces Analysis',
    course: 'physics-mechanics-fundamentals',
    courseTitle: 'Physics: Mechanics & Energy',
    chapter: 'physics_m1',
    chapterTitle: 'Kinematics & Newton\'s Laws',
    type: 'Text',
    question: '<p>A projectile is launched with an initial velocity of 20 m/s at an angle of 30° above the horizontal. Assuming g = 9.8 m/s² and negligible air resistance, calculate the maximum height reached and horizontal range. Show equations and steps.</p>',
    show_answer: true,
    answer: 'v0y = 20 * sin(30°) = 10 m/s\nv0x = 20 * cos(30°) = 17.32 m/s\nTime to peak t = 10 / 9.8 = 1.02 s\nMax Height H = (10^2) / (2 * 9.8) = 5.10 m\nTotal flight time T = 2 * 1.02 = 2.04 s\nRange R = 17.32 * 2.04 = 35.35 m',
    evaluation_criteria: [
      'Decomposes initial velocity into horizontal and vertical vector components',
      'Applies kinematic equation for maximum vertical height',
      'Calculates total flight duration correctly',
      'Determines total horizontal range with appropriate physical units'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>A projectile is launched with an initial velocity of 20 m/s at an angle of 30° above the horizontal. Assuming g = 9.8 m/s² and negligible air resistance, calculate the maximum height reached and horizontal range. Show equations and steps.</p>',
        sample_answer: 'v0y = 10 m/s, v0x = 17.32 m/s. Max height H = 5.10 m, Total range R = 35.35 m.'
      }
    ]
  },
  {
    id: 'assign-calculus-derivatives',
    title: 'Derivative Optimization & Tangent Analysis',
    course: 'calculus-advanced-mathematics',
    courseTitle: 'Mathematics: Calculus & Analysis',
    chapter: 'math_m1',
    chapterTitle: 'Limits & Differential Calculus',
    type: 'Text',
    question: '<p>Given the cubic polynomial f(x) = 2x³ - 9x² + 12x + 1, find all critical points, determine whether each is a local maximum or minimum using the second derivative test, and state intervals of concavity.</p>',
    show_answer: true,
    answer: 'f\'(x) = 6x² - 18x + 12 = 6(x - 1)(x - 2) = 0 => Critical points at x = 1 and x = 2.\nf\'\'(x) = 12x - 18.\nAt x = 1: f\'\'(1) = -6 < 0 => Local Maximum at (1, 6).\nAt x = 2: f\'\'(2) = +6 > 0 => Local Minimum at (2, 5).\nf\'\'(x) = 0 at x = 1.5. Concave down on (-inf, 1.5), concave up on (1.5, +inf).',
    evaluation_criteria: [
      'Computes the first derivative f\'(x) accurately',
      'Solves for critical points x = 1 and x = 2',
      'Applies second derivative test f\'\'(x) to classify extrema',
      'Determines inflection point and concavity intervals'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>Given the cubic polynomial f(x) = 2x³ - 9x² + 12x + 1, find all critical points, determine whether each is a local maximum or minimum using the second derivative test, and state intervals of concavity.</p>',
        sample_answer: 'Critical points at x = 1 (local max, 6) and x = 2 (local min, 5). Inflection point at x = 1.5.'
      }
    ]
  },
  {
    id: 'assign-chemistry-stoichiometry',
    title: 'Stoichiometric Yield & Limiting Reactant Analysis',
    course: 'general-physical-chemistry',
    courseTitle: 'Chemistry: Atoms, Bonds & Reactions',
    chapter: 'chem_m2',
    chapterTitle: 'Reactions, Stoichiometry & Acid-Base Equilibrium',
    type: 'Text',
    question: '<p>Consider the reaction: 2 Al + 3 Cl2 -> 2 AlCl3. If 54.0 g of aluminum reacts with 142.0 g of chlorine gas, identify the limiting reactant, calculate the theoretical yield of aluminum chloride in grams, and determine the mass of excess reactant remaining.</p>',
    show_answer: true,
    answer: 'Molar masses: Al = 27.0 g/mol, Cl2 = 71.0 g/mol, AlCl3 = 133.5 g/mol.\nMoles of Al = 54.0 / 27.0 = 2.00 mol.\nMoles of Cl2 = 142.0 / 71.0 = 2.00 mol.\nStoichiometric requirement: 2.00 mol Al requires 3.00 mol Cl2. Since only 2.00 mol Cl2 is available, Cl2 is the limiting reactant.\nMoles of AlCl3 produced = 2.00 * (2/3) = 1.33 mol.\nTheoretical yield = 1.33 mol * 133.5 g/mol = 178.0 g.\nMoles of Al consumed = 2.00 * (2/3) = 1.33 mol. Remaining Al = 2.00 - 1.33 = 0.67 mol = 18.0 g.',
    evaluation_criteria: [
      'Converts given masses to moles using molar masses',
      'Correctly identifies Cl2 as the limiting reagent',
      'Calculates theoretical yield of AlCl3 in grams',
      'Determines remaining unreacted mass of excess Al'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>Calculate the limiting reactant, theoretical yield of AlCl3, and excess reactant remaining when 54.0 g Al reacts with 142.0 g Cl2.</p>',
        sample_answer: 'Limiting reactant is Cl2. Theoretical yield of AlCl3 is 178.0 g. Excess Al remaining is 18.0 g.'
      }
    ]
  },
  {
    id: 'assign-biology-respiration',
    title: 'Cellular Respiration Pathways Comparison',
    course: 'cellular-biology-genetics',
    courseTitle: 'Biology: Cells & Molecular Genetics',
    chapter: 'bio_m1',
    chapterTitle: 'Cell Structure & Cellular Energetics',
    type: 'Text',
    question: '<p>Compare glycolysis, the citric acid (Krebs) cycle, and oxidative phosphorylation in terms of cellular location, input substrates, net ATP yield, and primary electron carriers produced.</p>',
    show_answer: true,
    answer: '1. Glycolysis: Cytoplasm, Input: 1 Glucose, Net ATP: 2 ATP (substrate-level), Electron carriers: 2 NADH.\n2. Citric Acid Cycle: Mitochondrial matrix, Input: 2 Acetyl-CoA, Net ATP: 2 ATP/GTP, Electron carriers: 6 NADH + 2 FADH2.\n3. Oxidative Phosphorylation: Inner mitochondrial membrane (cristae), Input: NADH, FADH2, O2, Net ATP: ~28-32 ATP, Electron carriers: NAD+ and FAD regenerated, H2O formed.',
    evaluation_criteria: [
      'Identifies intracellular organelle locations correctly',
      'Specifies input molecules and products for all three stages',
      'Contrasts substrate-level vs oxidative ATP synthesis yields',
      'Explains roles of NADH and FADH2 in electron transport'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>Compare glycolysis, the citric acid cycle, and oxidative phosphorylation in terms of location, net ATP, and electron carriers.</p>',
        sample_answer: 'Glycolysis (cytoplasm, 2 ATP, 2 NADH); Krebs cycle (matrix, 2 ATP, 6 NADH, 2 FADH2); Oxidative phosphorylation (cristae, ~28 ATP, regenerates NAD+/FAD).'
      }
    ]
  },
  {
    id: 'assign-python-fibonacci',
    title: 'Implementing Fibonacci Sequence Generator',
    course: 'python-programming-essentials',
    courseTitle: 'Python Programming Essentials',
    chapter: 'python_m1',
    chapterTitle: 'Python Basics & Core Collections',
    type: 'Text',
    question: '<p>Write a Python function <code>fibonacci(n)</code> that returns the first <code>n</code> Fibonacci numbers as a list. Hand in the source code file or code text.</p>',
    show_answer: true,
    answer: 'def fibonacci(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq',
    evaluation_criteria: [
      'Function named fibonacci(n) returning a list',
      'Handles edge cases n <= 0 and n == 1 correctly',
      'Uses loop or recursion to build correct sequence',
      'Time complexity O(N) or efficient execution'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>Write a Python function <code>fibonacci(n)</code> that returns the first <code>n</code> Fibonacci numbers as a list.</p>',
        sample_answer: 'def fibonacci(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq'
      }
    ]
  },
  {
    id: 'assign-web-responsive-card',
    title: 'Responsive Flexbox Product Card Implementation',
    course: 'modern-web-development-html-css',
    courseTitle: 'Web Development: HTML & CSS',
    chapter: 'web_m2',
    chapterTitle: 'CSS Styling, Box Model & Flexbox',
    type: 'Text',
    question: '<p>Write semantic HTML5 markup and modern CSS using Flexbox to build a responsive profile or product card. Ensure proper padding, border-radius, box-shadow, and a hover transition effect.</p>',
    show_answer: true,
    answer: '<article class="card">\n  <img src="avatar.jpg" alt="Profile avatar" class="card-img" />\n  <div class="card-body">\n    <h2>Alex Mercer</h2>\n    <p>Senior Full-Stack Developer</p>\n    <button class="btn">Connect</button>\n  </div>\n</article>\n\n<style>\n.card { display: flex; flex-direction: column; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s ease; overflow: hidden; }\n.card:hover { transform: translateY(-4px); }\n.card-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }\n</style>',
    evaluation_criteria: [
      'Uses semantic HTML elements (<article>, <h2>, <button>)',
      'Applies CSS Flexbox alignment properties',
      'Implements clean spacing via padding and margin',
      'Demonstrates interactive hover transition'
    ],
    pass_threshold: 70,
    min_char_count: 20,
    questions: [
      {
        id: 1,
        prompt: '<p>Write semantic HTML5 and CSS Flexbox code for a responsive card component with hover transition.</p>',
        sample_answer: 'Semantic <article> with display: flex, padding, border-radius, and transform transition on hover.'
      }
    ]
  }
];

export function parseQuestionsList(questionStr, extraQuestions, defaultAnswer) {
  if (Array.isArray(extraQuestions) && extraQuestions.length > 0) {
    return extraQuestions;
  }
  if (!questionStr) return [{ id: 1, prompt: '', sample_answer: defaultAnswer || '' }];

  const regex = /(?:Question\s+(\d+)[:\.-]?\s*)/gi;
  const matches = [...questionStr.matchAll(regex)];

  if (matches.length > 1) {
    const parsed = [];
    for (let i = 0; i < matches.length; i++) {
      const startIndex = matches[i].index + matches[i][0].length;
      const endIndex = (i + 1 < matches.length) ? matches[i + 1].index : questionStr.length;
      const promptText = questionStr.substring(startIndex, endIndex).trim();
      if (promptText) {
        parsed.push({
          id: i + 1,
          prompt: promptText,
          sample_answer: ''
        });
      }
    }
    if (parsed.length > 0) return parsed;
  }

  return [{ id: 1, prompt: questionStr, sample_answer: defaultAnswer || '' }];
}

export const DEFAULT_ASSIGNMENT_SUBMISSIONS = [
  {
    id: 'sub-fibonacci-1',
    assignment: 'assign-python-fibonacci',
    assignment_title: 'Implementing Fibonacci Sequence Generator',
    type: 'Text',
    member: 'alex.student@apex.edu',
    member_name: 'Alex Rivera',
    evaluator: '',
    status: 'Not Graded',
    question: 'Write a Python function fibonacci(n) that returns the first n Fibonacci numbers as a list. Hand in the source code file or code text.',
    answer: `def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    fib_series = [0, 1]
    for i in range(2, n):
        next_val = fib_series[-1] + fib_series[-2]
        fib_series.append(next_val)
    return fib_series`,
    course: '1',
    lesson: 'l2',
    timestamp: '2026-09-26T14:30:00.000Z'
  },
  {
    id: 'sub-fibonacci-2',
    assignment: 'assign-python-fibonacci',
    assignment_title: 'Implementing Fibonacci Sequence Generator',
    type: 'Text',
    member: 'priya.sharma@globaleng.edu',
    member_name: 'Priya Sharma',
    evaluator: '',
    status: 'Not Graded',
    question: 'Write a Python function fibonacci(n) that returns the first n Fibonacci numbers as a list. Hand in the source code file or code text.',
    answer: `def fibonacci(n):
    # Generates fibonacci list up to n elements
    res = []
    a, b = 0, 1
    for _ in range(n):
        res.append(a)
        a, b = b, a + b
    return res`,
    course: '1',
    lesson: 'l2',
    timestamp: '2026-09-26T15:10:00.000Z'
  },
  {
    id: 'sub-sorting-1',
    assignment: 'assign-dsa-sorting',
    assignment_title: 'Custom Merge Sort Complexity Analysis',
    type: 'Text',
    member: 'rahul.v@apex.edu',
    member_name: 'Rahul Verma',
    evaluator: '',
    status: 'Not Graded',
    question: 'Compare the computational complexity and space requirements of Merge Sort and In-place Quicksort. Submit a report explaining edge cases.',
    answer: `Merge Sort vs Quicksort Complexity Analysis:

1. Time Complexity:
- Merge Sort: Always O(N log N) in best, average, and worst cases because it consistently divides arrays in half and requires O(N) merge steps.
- Quicksort: Average case O(N log N), but worst-case degrades to O(N^2) if the pivot chosen is consistently the extreme element (e.g. already sorted array without randomized pivot).

2. Space Complexity:
- Merge Sort: O(N) auxiliary space required for temporary merge buffers.
- Quicksort: O(log N) stack space for recursive calls, operates in-place.

3. Stability:
- Merge Sort is stable (preserves relative order of duplicate elements).
- Standard Quicksort is unstable due to far-distance swaps.

4. Edge Cases:
- Empty array: handled in base case len <= 1.
- Duplicate values: Merge sort handles duplicates stably without performance penalty.`,
    course: '2',
    lesson: '2_m1',
    timestamp: '2026-09-26T16:45:00.000Z'
  }
];

export const DEFAULT_JOBS = [
  { id: '1', title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', type: 'Full Time', work_mode: 'Hybrid', status: 'Open', company_website: 'https://google.com', description: '<p>We are looking for a Senior Software Engineer with strong background in distributed systems and systems design.</p>', date: 'Posted 2 days ago' },
  { id: '2', title: 'Frontend Developer (React)', company: 'Meta', location: 'Remote', type: 'Full Time', work_mode: 'Remote', status: 'Open', company_website: 'https://meta.com', description: '<p>Build the next generation of social applications using React, Next.js, and modern CSS.</p>', date: 'Posted 3 days ago' },
  { id: '3', title: 'Product Design Intern', company: 'Figma', location: 'San Francisco, CA', type: 'Part Time', work_mode: 'On-site', status: 'Open', company_website: 'https://figma.com', description: '<p>Join our design systems team to shape the tool that designers around the world use daily.</p>', date: 'Posted 5 days ago' },
  { id: '4', title: 'Full Stack Engineer', company: 'Vercel', location: 'Remote', type: 'Full Time', work_mode: 'Remote', status: 'Open', company_website: 'https://vercel.com', description: '<p>Work on Next.js and Vercel hosting platform features. Experience in Rust and Node.js is a plus.</p>', date: 'Posted 1 week ago' },
  { id: '5', title: 'Python Backend Specialist', company: 'OpenAI', location: 'San Francisco, CA', type: 'Full Time', work_mode: 'On-site', status: 'Closed', company_website: 'https://openai.com', description: '<p>Help train and run neural networks using high-performance Python APIs.</p>', date: 'Posted 1 week ago' },
];
