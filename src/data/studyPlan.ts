export interface DayPlan {
  day: number;
  week: number;
  topic: string;
  task: string;
  notes: string;
  motivation: string;
  challenge: string;
  codeTemplate?: string;
}

export const INITIAL_STUDY_PLAN: DayPlan[] = [
  // WEEK 1: Python Basics & Modular Programming
  {
    day: 1,
    week: 1,
    topic: "Python Setup & Interpreter Basics",
    task: "Configure your local environment (VS Code / Jupyter), write your first script printing statements, comments, and explore basic operators.",
    notes: "Understand how Python translates script files (.py) into bytecode (.pyc) executed by the Virtual Machine. Test dynamic calculations in interactive shell.",
    motivation: "The journey of a thousand steps begins with a single line of code. Don't worry about complexity today—focus on running your first bug-free script!",
    challenge: "Write a script that queries the python-sys module variables to print your current interpreter path, system platform, and Python version details.",
    codeTemplate: "import sys\n\nprint('Hello world!')\nprint('Interpreter location:', sys.executable)"
  },
  {
    day: 2,
    week: 1,
    topic: "Variables & Dynamic Typing",
    task: "Experiment with type-casting (int, float, str, bool), investigate memory assignment, and demonstrate Python's dynamic binding behavior.",
    notes: "In Python, variables are labels bound to objects (references), not typed memory boxes. Use id() to verify original variables versus reassigned targets.",
    motivation: "Variables are the vocabulary of programming. Master reference binding and memory labels now, and nested algorithm states will make complete sense later!",
    challenge: "Write a script demonstrating mutability by showing that updating a member in an assigned list modifies all variables binding to that exact list id, whereas reassigning strings does not.",
    codeTemplate: "# Examine object references\na = [1, 2, 3]\nb = a\na.append(4)\nprint(f'a: {a}, id: {id(a)}')\nprint(f'b: {b}, id: {id(b)}') # Notice how b changed as well!"
  },
  {
    day: 3,
    week: 1,
    topic: "Control Flow: Conditionals",
    task: "Build a multi-conditional calculator (using if-elif-else) evaluating student grades or progressive tax bands.",
    notes: "Ensure complete logical coverage. Avoid redundant conditions like (score > 80 and score <= 90) when nested order automatically handles it. Practice correct indentation.",
    motivation: "Conditionals are where your program learns to make decisions. Take it step-by-step, trace the path with sample values, and you will capture every edge case!",
    challenge: "Build a leap year checker that safely validates user entry and rejects negative or float integers gracefully using dynamic conditionals.",
    codeTemplate: "def check_year(year):\n    if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):\n        return True\n    return False"
  },
  {
    day: 4,
    week: 1,
    topic: "Loops & Dynamic Dry-Run Tables",
    task: "Write a countdown loop using `while`, and process numeric series using `for`. Complete a full manual dry-run trace table.",
    notes: "A dry-run table traces variables line by line. Columns: Line #, loop-state, index values, dynamic array states.",
    motivation: "Loops handle the heavy lifting of algorithms. Writing down variable states on paper during nested loops is a superpower—embrace dry-runs today!",
    challenge: "Create a nested double-loop pattern that outputs a dynamic fibonacci-spaced triangle pyramid of stars (*) up to a depth of N.",
    codeTemplate: "for i in range(1, 6):\n    # Print spaces and stars\n    print(' ' * (5 - i) + '*' * (2 * i - 1))"
  },
  {
    day: 5,
    week: 1,
    topic: "Functions, Parameters, & Scopes",
    task: "Implement variable-argument parameters (*args, **kwargs), return values, and examine local vs global namespace conflicts.",
    notes: "Define pure functions with no side effects. Global indicators are code smells in clean CS engineering; always pass inputs explicitly via parameters.",
    motivation: "Functions are modular Lego bricks. Building smaller, modular functions that do exactly one task perfectly keeps your codebase clean and beautiful.",
    challenge: "Design a customizable function mapper that takes an arbitrary mathematical function object (like lambda) alongside raw inputs to calculate dynamic sequences.",
    codeTemplate: "def apply_twice(func, val):\n    return func(func(val))\n\nprint(apply_twice(lambda x: x * 2, 5)) # Outputs 20!"
  },
  {
    day: 6,
    week: 1,
    topic: "Modular Programming & Helpers",
    task: "Organize your helper functions into custom modules under a dedicated subdirectory. Practice importing using import, from, and as aliases.",
    notes: "Python locates imports by searching directories defined in sys.path. Create an __init__.py file to learn how Python indexes library modules in modern setups.",
    motivation: "AIML pipelines are complex. Modular engineering separates data preparation from modeling logic. Today you are establishing proper architecture!",
    challenge: "Create a modular structure where 'analytics.py' imports 'math_helpers.py' across parent directories safely without executing code during standard import processes.",
    codeTemplate: "# math_helpers.py\ndef compute_mean(values):\n    return sum(values) / len(values) if values else 0\n\nif __name__ == '__main__':\n    print('Self-test: mean is working!')"
  },
  {
    day: 7,
    week: 1,
    topic: "Week 1 Reflection & Consolidation",
    task: "Complete the Week 1 self-checks. Assemble your modular scripts into a clean GitHub-style directory structure.",
    notes: "Take time to review how dynamic typing, loop states, and namespaces operate. Correct any logic or syntax misconceptions before entering week 2.",
    motivation: "Consistency beats intensity every single day. Celebrate finishing your first week of foundational training! You are forming strong CS neural pathways.",
    challenge: "Write a mini-CLI tracker that queries daily study task completion status and records details inside a local nested list structure.",
    codeTemplate: "# Reflective Self-Check Questions:\n# 1. Why does changing list 'A' affect list 'B' after simple assignment (B = A)?\n# 2. How does Python find imports in local custom directories?\n# 3. Can a local-variable namespace override a global declaration?"
  },

  // WEEK 2: Intermediate Python & Essential Data Structures
  {
    day: 8,
    week: 2,
    topic: "Lists & Tuples (Memory & Mutability)",
    task: "Perform list slicing, list comprehensions, and compare list dynamic sizing vs immutable, fixed-size tuple pre-allocation in memory.",
    notes: "Tuples are slightly faster to instantiate and prevent accidental overwrites. List comprehension is faster because it executes at bytecode level.",
    motivation: "In machine learning, features are processed in arrays. Learning index slicing and nested comprehensions today guarantees lightning-fast data manipulation tomorrow!",
    challenge: "Given a 2D matrix represented as a list of lists, transpose it in a single line using list comprehension and zip unpacking.",
    codeTemplate: "matrix = [[1, 2], [3, 4], [5, 6]]\ntransposed = [list(row) for row in zip(*matrix)]\nprint(transposed) # [[1, 3, 5], [2, 4, 6]]"
  },
  {
    day: 9,
    week: 2,
    topic: "Dictionaries & Sets",
    task: "Build word-count index structures, verify O(1) key lookups, and use sets for high-performance algebraic unique member intersection queries.",
    notes: "Dictionaries use hashing algorithms under the hood. Avoid KeyErrors safely by using the .get(key, default) method.",
    motivation: "Sets and dictionaries turn slow O(N) linear operations into instant O(1) lookups. This optimization forms the baseline of big data pipelines!",
    challenge: "Build a word frequency dictionary parser that filters out common stop-words (like 'is', 'the') in a single pass over an input text string.",
    codeTemplate: "text = 'the quick brown fox jumps over the lazy dog'\nwords = text.split()\nstop_words = {'the', 'over', 'is'}\n# Filter stop words and map count\nfreq = {}\nfor w in words:\n    if w not in stop_words:\n        freq[w] = freq.get(w, 0) + 1"
  },
  {
    day: 10,
    week: 2,
    topic: "String Manipulation & Text Processing",
    task: "Apply built-in string methods, execute regex filters, and format raw inputs with f-strings.",
    notes: "Python strings are strictly immutable. Any concatenation operation creates a new allocations in memory, so use '.join()' for massive iterations instead of '+' loop cascades.",
    motivation: "NLP (Natural Language Processing) begins with text cleaning. Mastering string operations is your first major step into sequence processing!",
    challenge: "Build a strict password validation parser checking length, numbers, symbols, and capitals without importing external libraries.",
    codeTemplate: "def clean_text(text):\n    # Strip surrounding blanks, convert casing, clean elements\n    return ' '.join(text.strip().lower().split())"
  },
  {
    day: 11,
    week: 2,
    topic: "File handling & Data Streams",
    task: "Practice safe file operations using `with open(...)` context managers to import logs and save clean tabular summaries.",
    notes: "The context manager automatically resolves system close commands even when exceptions are thrown, protecting memory segments from logical leak states.",
    motivation: "Data science revolves around file I/O. Reading datasets from spreadsheets, CSVs, or text streams is the raw interface of all ML libraries!",
    challenge: "Write a processor that reads a CSV dataset line-by-line and calculates aggregates of numeric columns without loading full file memory arrays.",
    codeTemplate: "with open('sample.txt', 'w') as f:\n    f.write('Day 11: File streams successfully tested!')"
  },
  {
    day: 12,
    week: 2,
    topic: "Exceptional Safety & Logic Recovery",
    task: "Write nested try-except-finally blocks, enforce pre-checks, and raise custom domain exceptions.",
    notes: "Only catch precise, anticipated error classes (e.g., ValueError, ZeroDivisionError). Blanket 'except Exception' captures syntax bugs, complicating code health.",
    motivation: "Robust AIML production code must deal with missing values, corrupt logs, or incomplete data streams. Handling failures gracefully prevents pipeline crashes!",
    challenge: "Implement an API retry operator simulator that runs an unreliable code call up to 3 times before raising a custom ConnectionTimeout error.",
    codeTemplate: "try:\n    # Code block that might fail\n    x = int('not_an_int')\except ValueError as e:\n    print(f'Caught expected error: {e}')"
  },
  {
    day: 13,
    week: 2,
    topic: "Complexity Analysis: Big O Space & Time",
    task: "Trace code segments and calculate their explicit Big O complexity. Compare linear operations versus logarithmic algorithms.",
    notes: "Focus heavily on nested loop iterations. Understand how logarithmic O(log N) behavior emerges when input search windows are halved at each turn.",
    motivation: "Writing code is easy; writing scalable code requires theoretical maturity. Learning Big O differentiates professional CS engineers from amateurs!",
    challenge: "Design a timing profiler showing how dictionary lookups scale with N items vs linear lists processing search queries on identical indices.",
    codeTemplate: "import time\n# Compare execution speeds\nstart = time.perf_counter()\n# linear check...\nprint(f'Duration: {time.perf_counter() - start:.8f}s')"
  },
  {
    day: 14,
    week: 2,
    topic: "Week 2 Reflection: Data Architecture",
    task: "Conduct Week 2 self-check. Analyze code structures matching lookup limits. Refine complex variables.",
    notes: "Ensure complete clarity regarding sets, files, custom streams, safe namespaces, and performance costs.",
    motivation: "Two weeks complete! Your foundation is strong. Moving from basic syntax into structural algorithms next week is where the magic happens.",
    challenge: "Reflect on how hashing lists into sets optimization impacts performance. Write a markdown analysis covering dictionary scaling variables.",
    codeTemplate: "# Study plan progress check:\n# List index operations vs Dictionary hashing.\n# Self-Review: Can you explain how dictionary speedups occur?"
  },

  // WEEK 3: Essential DSA & Algorithmic Thinking
  {
    day: 15,
    week: 3,
    topic: "Recursion Basics (The Call Stack)",
    task: "Implement recursion with basic termination states. Calculate mathematical sequences like factorials and Fibonacci values.",
    notes: "Every recursive call allocates an active activation frame on the CPU call stack. Always define a unambiguous base-case to prevent infinite recursion and Stack Overflow.",
    motivation: "Recursion asks you to trust your functions. Break problems into a base-case and a smaller sub-problem, and watch complex structures resolve elegantly!",
    challenge: "Write a recursive function that extracts all nested directories and file pathways inside an arbitrarily nested JSON array structure.",
    codeTemplate: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)"
  },
  {
    day: 16,
    week: 3,
    topic: "Dry Running Recursion with Trees",
    task: "Map the internal execution process of recursive Fibonacci or Merge actions. Draw full call trees tracking return values.",
    notes: "Call logs reveal recursion timing behavior. Standard recursive Fibonacci has an O(2^N) exponential complexity caused by massive redundant branches.",
    motivation: "Visualizing the execution tree removes the mystery of recursion. Tracing activation frames establishes deep mental computer architecture models!",
    challenge: "Incorporate localized debugging logs that indent with every call depth level to print live recursion tree structures in real-time.",
    codeTemplate: "def factorial_logged(n, depth=0):\n    print('  ' * depth + f'fac({n}) called')\n    if n <= 1:\n        return 1\n    return n * factorial_logged(n - 1, depth + 1)"
  },
  {
    day: 17,
    week: 3,
    topic: "Binary Search & Divide-and-Conquer",
    task: "Design and code the O(log N) Binary Search algorithm, tracking pointers (low, high, mid) iteratively.",
    notes: "Binary search requires sorting. Always ensure inputs are sorted before execution, else searching returns erroneous results.",
    motivation: "Binary search is the classic Divide-and-Conquer technique. Halving choices cuts searchable spaces down with incredible logarithm curves!",
    challenge: "Modify binary search to discover both the absolute first and final occurance index profiles of duplicate items in an array list.",
    codeTemplate: "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n          else:\n            high = mid - 1\n    return -1"
  },
  {
    day: 18,
    week: 3,
    topic: "Bubble Sort & Sorting Realities",
    task: "Code manual Bubble Sort tracking passes, list swaps, and optimize inner boundaries using flag constructs.",
    notes: "Bubble sort has O(N^2) time complexity. Adding an early-termination check if a pass completes with zero swaps improves best-case timing to linear O(N).",
    motivation: "Sorting orders disorder. Understanding how comparisons sort data provides direct intuition into feature ranking algorithms!",
    challenge: "Trace a manual dry-run table for Bubble Sort handling descending lists, noting every value mutation and pass comparison step.",
    codeTemplate: "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = True\n        if not swapped: break"
  },
  {
    day: 19,
    week: 3,
    topic: "Merge Sort (Divide-and-Conquer)",
    task: "Build the recursive Merge Sort algorithm, separating subdivisions and merging sorted subdivisions.",
    notes: "Merge sort guarantees O(N log N) performance across all inputs but has a space complexity constraint of O(N) due to temporary division arrays.",
    motivation: "Divide-and-Conquer shines in Merge Sort. Master this, and you've conquered one of the post valuable algorithms in modern software computing!",
    challenge: "Rewrite your sorting module to handle list sorting on custom keys, like string length or age elements inside dictionaries.",
    codeTemplate: "def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr)//2\n        L = arr[:mid]\n        R = arr[mid:]\n        merge_sort(L); merge_sort(R)\n        # Include merger steps... (See AI helper for full script)"
  },
  {
    day: 20,
    week: 3,
    topic: "Stacks & Queues (Linear Pipelines)",
    task: "Construct custom FIFO/LIFO models using Python lists and collections.deque modules.",
    notes: "Standard list popped indexes (input pop(0)) run in slow O(N) due to element shifting. Use collections.deque for true constant O(1) double-ended queue entries.",
    motivation: "Linear stacks shape program execution frames, and queues form the basis of ML data loading pipelines. Today you construct their foundations!",
    challenge: "Implement a brackets-syntax helper that checks whether code expressions have balanced parentheses using a tracking list stack.",
    codeTemplate: "from collections import deque\nqueue = deque(['A', 'B', 'C'])\nqueue.append('D')\nqueue.popleft() # Constant-time removal!"
  },
  {
    day: 21,
    week: 3,
    topic: "Week 3 Reflection & DSA Profiling",
    task: "Reflect on Divide-and-Conquer concepts. Build a comprehensive performance table outlining variables across binary search, recursion, and merge sorting.",
    notes: "Review stack tracking lists, midpoints, recurrence patterns, and sorted boundaries. Ensure no syntax issues persist.",
    motivation: "Three weeks done! You are no longer just writing code—you are reasoning about system performance, execution layers, and computational bottlenecks.",
    challenge: "Formulate code benchmarks tracing execution times of recursive functions vs linear iterations across various target depths.",
    codeTemplate: "# Finalizing DSA Foundations:\n# Check recursion depths limits using sys.getrecursionlimit()\n# Self check: Why is binary search faster than linear scan?"
  },

  // WEEK 4: AI/ML Foundations & Math Essentials
  {
    day: 22,
    week: 4,
    topic: "Linear Algebra Essentials (Vector-Matrix Concepts)",
    task: "Understand vectors, matrices, dimensionality, and code a manual matrix multiplication algorithm using nested loops.",
    notes: "Machine learning treats data as high-dimensional coordinates. Columns represent features, rows represent records. Key actions: dot products, scaling. A matrix multiplication of shape (A, B) times (B, C) produces (A, C). Notice that matching inner sizes (B) is a strict requirement.",
    motivation: "All deep learning, neural layers, and graphics pipelines boil down to matrix multiplication. Today, you build that foundational mathematical lens!",
    challenge: "Implement a dot product calculation function checking matching dimension criteria without importing NumPy.",
    codeTemplate: "v1 = [1, 2, 3]\nv2 = [4, 5, 6]\ndot_product = sum(x * y for x, y in zip(v1, v2))"
  },
  {
    day: 23,
    week: 4,
    topic: "Descriptive Statistics manually",
    task: "Write custom code calculating mean, median, mode, variance, and standard deviation manually from numerical datasets.",
    notes: "Variance measures distance from mean squared. Standard deviation is original-unit dispersion. Hand-coding statistical metrics locks in mathematical intuition.",
    motivation: "Algorithms learn patterns by minimizing error variance. Descriptive statistics are the metrics you use to inspect data before training model loops!",
    challenge: "Design a function that computes the Pearson Correlation Coefficient from dual related data sequences.",
    codeTemplate: "data = [10, 12, 23, 23, 34, 45]\ndef calc_variance(arr):\n    mean = sum(arr) / len(arr)\n    return sum((x - mean) ** 2 for x in arr) / (len(arr) - 1)"
  },
  {
    day: 24,
    week: 4,
    topic: "NumPy Foundations (Fast Arrays)",
    task: "Create 1D and 2D arrays, practice advanced fancy slicing, and verify vectorized arithmetic performance.",
    notes: "NumPy arrays are continuous blocks of memory wrapping compile C arrays. They avoid Python object reference list redirection, achieving drastic performance gains.",
    motivation: "NumPy is the backbone of ML libraries. Vectorized broadcasting means you don't use nested loops to scale data items. Faster execution made simple!",
    challenge: "Create a 5x5 zero matrix, set its outline borders to 1, and scale internal cell items diagonally using optimized index grids.",
    codeTemplate: "# Note: You can ask the AI Assistant block to explain Numpy if missing locally\n# import numpy as np\n# arr = np.array([[1, 2], [3, 4]])\n# print(arr * 2) # Vectorized multiplication!"
  },
  {
    day: 25,
    week: 4,
    topic: "Pandas Foundations (DataFrames)",
    task: "Create DataFrames from dictionaries, load sample CSV records, query specific indices, and perform data group aggregate calculations.",
    notes: "DataFrames hold structured schema records. Use pandas functions like .describe() for immediate, robust column distributions profiles.",
    motivation: "Cleaning datasets, processing null records, and filtering input columns will occupy 70% of your machine learning time. Master DataFrames today!",
    challenge: "Load a complex log dataframe, fill empty null cells with column medians, and extract subset records on combined conditions.",
    codeTemplate: "# import pandas as pd\n# data = {'Age': [25, 30, None, 45], 'Salary': [50000, 60000, 55000, 80000]}\n# df = pd.DataFrame(data)\n# print(df.isnull().sum())"
  },
  {
    day: 26,
    week: 4,
    topic: "Introduction to Machine Learning Taxonomy",
    task: "Contrast and define supervised, unsupervised, and reinforcement learning paradigms, parsing features (X) from labels (y).",
    notes: "Feature vectors contain descriptive variables. Label values contain target answers. Linear regression fits linear weight balances.",
    motivation: "Welcome to AI modeling! Structuring problems into correct ML setups is the difference between random guesswork and industrial predictive models.",
    challenge: "Map real-world tasks (fraud detection, recommendation, image classification) into explicit supervised/unsupervised category targets.",
    codeTemplate: "# ML Conceptual Map:\n# Supervised: Inputs (X) -> Labels (y). Goal: Learn f(x) to approximate y\n# Unsupervised: Input (X) alone. Goal: Learn structure and clusters"
  },
  {
    day: 27,
    week: 4,
    topic: "Closed-Form Simple Linear Regression",
    task: "Implement slope (m) and intercept (c) calculations manually from 2D sample datasets using statistical covariance formulas.",
    notes: "Formula: m = Cov(x,y) / Var(x). Predicting outputs: y_pred = m * x + c. Evaluate predictions by calculating Mean Squared Error (MSE).",
    motivation: "Coding linear relationships is regression in its purest form. When you can calculate straight line fits manually, modern deep learning weight updates are minor jumps!",
    challenge: "Develop a prediction pipeline testing multi-point datasets and outputting the complete Mean Squared Error to verify mathematical line fits.",
    codeTemplate: "x = [1, 2, 3, 4, 5]\ny = [2, 3, 5, 6, 8]\n# Build slope: m = Sum((x-mx)*(y-my)) / Sum((x-mx)^2)\nmean_x = sum(x)/len(x)\nmean_y = sum(y)/len(y)"
  },
  {
    day: 28,
    week: 4,
    topic: "Designing a training update loop simulation",
    task: "Formulate a gradient update simulator. Code recursive error calculation, weight adjustments, learning rates, and track loss iteration steps.",
    notes: "Weights update iteratively step-by-step: weight = weight - learning_rate * loss_derivative. Check how gradient values guide search states. Learning rate controls weight step size; setting it too high prompts divergence, while setting it too low extends search tracks.",
    motivation: "Today, you code a real neural-style gradient parameter training update loop from scratch! You are learning deep learning from inside out!",
    challenge: "Experiment by setting varied learning rates (0.1, 0.0001) in your update simulation loop and document loss trends.",
    codeTemplate: "w = 0.5\nlr = 0.1\n# Run steps\nfor epoch in range(10):\n    y_pred = w * 2\n    loss_deriv = 2 * (y_pred - 4) * 2\n    w = w - lr * loss_deriv\n    print(f'Epoch {epoch}: weight={w:.4f}')"
  },
  {
    day: 29,
    week: 4,
    topic: "Capstone Project: End-to-End Analytics Pipeline",
    task: "Develop a self-contained data pipeline: consume data inputs, compute statistical features, fit predictor models, and output structured report summaries.",
    notes: "This capstone combines code execution modules, sorting helpers, and statistical slope fits into a single, cohesive modular program.",
    motivation: "You are integrating your entire 30 days of study into a single masterwork! The skills you are combining today constitute standard engineering roles.",
    challenge: "Enhance your capstone pipeline script to output log file write outs and command argument parameters seamlessly.",
    codeTemplate: "# Capstone Checklist:\n# ✔ Ready list text processing modules\n# ✔ Deploy mathematical statistical tools\n# ✔ Fit regression predictions\n# ✔ Run pipeline reports"
  },
  {
    day: 30,
    week: 4,
    topic: "Final Reflection & AIML Pathways",
    task: "Review the full syllabus, finalize your CS portfolio templates, and structure your next-stage Scikit-Learn maps.",
    notes: "Examine Python variables, recursive tree bounds, dynamic vector optimizations, linear variables, and weights update steps. Write a summary of what you've achieved to share with mentors or publish as a blog post.",
    motivation: "Congratulations, graduate! You have completed the intensive 30-day foundational AIML syllabus. Your theoretical and hands-on skill is validated!",
    challenge: "Write a comprehensive review report cataloging all modular algorithms and training codes you have designed over this course.",
    codeTemplate: "# Day 30 Graduation Checklist:\n# [x] Foundational python variables, scopes\n# [x] Data structures dictionaries, sets, files\n# [x] Algorithms sorting, trees, search bounds\n# [x] Math matrices, slopes, updates"
  }
];
