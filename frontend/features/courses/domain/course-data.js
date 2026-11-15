import syllabusesData from '@/data/syllabuses.json';
import { T } from '@/shared/design-system/theme';

export const COURSE = {
  title: "Python Programming", tagline: "From zero to Python hero in 5 structured modules",
  modules: [
    {
      id: "m1", title: "Getting Started", emoji: "🚀", accent: "#5B8CF8", lessons: [
        { id: "l1", title: "What is Python?", dur: "10 min", vid: "rfscVS0vtbw",
          overview: "Python is a versatile, high-level interpreted language known for clean readable syntax. Created by Guido van Rossum in 1991, now one of the world's most popular languages.",
          pts: ["Interpreted \u2014 runs line by line", "Dynamically typed \u2014 no declarations needed", "Cross-platform: Windows, Mac, Linux", "400,000+ packages on PyPI"] },
        { id: "l2", title: "Variables & Data Types", dur: "14 min", vid: "_uQrJ0TkZlc",
          overview: "Variables store data values. Python creates them on assignment \u2014 no declaration needed. Core types: int, float, str, bool, NoneType.",
          pts: ["x = 10 creates an integer variable", "type() reveals the data type", "Python is dynamically typed", "None represents absence of value"] },
        { id: "l3", title: "Strings", dur: "16 min", vid: "k9TUPpljqLs",
          overview: "Strings are immutable sequences of characters. They support slicing, f-strings for formatting, and dozens of built-in methods.",
          pts: ["f-strings: f\"Hello {name}\"", "Slicing: s[0:5] gets first 5 chars", ".upper(), .lower(), .strip(), .split()", "len() returns string length"] },
      ]
    },
    {
      id: "m2", title: "Control Flow", emoji: "\uD83D\uDD00", accent: "#22C5A0", lessons: [
        { id: "l4", title: "If / Elif / Else", dur: "13 min", vid: "DZwmZ8Usvnk",
          overview: "Conditional statements let you branch code execution based on truth conditions. Python uses indentation to define code blocks.",
          pts: ["Indentation defines the block", "==, !=, <, >, <=, >= comparisons", "and, or, not logical operators", "Ternary: x if cond else y"] },
        { id: "l5", title: "For Loops", dur: "18 min", vid: "6iF8Xb7Z3wQ",
          overview: "For loops iterate over any iterable \u2014 lists, strings, ranges, dicts. Combined with enumerate() and zip() they're extremely powerful.",
          pts: ["range(5) generates 0,1,2,3,4", "enumerate() adds an index", "zip() pairs two iterables", "List comprehensions: [x*2 for x in lst]"] },
        { id: "l6", title: "While Loops", dur: "11 min", vid: "n1dpPT2EHRg",
          overview: "While loops run as long as a condition remains True. Always ensure the loop terminates to avoid infinite loops.",
          pts: ["while condition: block", "break exits immediately", "continue skips to next iteration", "while True: + break pattern"] },
      ]
    },
    {
      id: "m3", title: "Functions", emoji: "\u2699\uFE0F", accent: "#F5A95B", lessons: [
        { id: "l7", title: "Defining Functions", dur: "20 min", vid: "9Os0o3wzS_I",
          overview: "Functions are reusable named code blocks. def creates them. They help avoid repetition and keep programs organized and testable.",
          pts: ["def function_name(params):", "return sends back a value", "Docstrings document the function", "Functions are first-class objects"] },
        { id: "l8", title: "*args & **kwargs", dur: "17 min", vid: "tuVd3qC9P2c",
          overview: "*args captures any number of positional arguments as a tuple. **kwargs captures keyword arguments as a dict. Essential for flexible APIs.",
          pts: ["Default values: def f(x, y=10)", "*args: variable positional args", "**kwargs: variable keyword args", "Order: regular \u2192 *args \u2192 **kwargs"] },
        { id: "l9", title: "Lambda & map/filter", dur: "15 min", vid: "Sv9ZXMGbhTQ",
          overview: "Lambda creates anonymous one-line functions. map(), filter(), and sorted(key=) are higher-order functions that accept other functions.",
          pts: ["lambda x: x*2 is anonymous", "map(func, iterable) transforms each", "filter(func, iterable) keeps True items", "sorted(lst, key=lambda x: x[1])"] },
      ]
    },
    {
      id: "m4", title: "Data Structures", emoji: "\uD83D\uDCE6", accent: "#9B6EF8", lessons: [
        { id: "l10", title: "Lists", dur: "22 min", vid: "W8KRzm-HUcc",
          overview: "Lists are ordered, mutable sequences \u2014 Python's most versatile structure. They hold any type and support slicing, sorting, and comprehensions.",
          pts: ["lst.append(x) adds to end", "lst.pop() removes last item", "lst[1:4] slices elements", "Nested lists for 2D structures"] },
        { id: "l11", title: "Dictionaries", dur: "20 min", vid: "daefaLgNkw0",
          overview: "Dicts store key-value pairs. Python 3.7+ maintains insertion order. Perfect for structured data, configs, and counting.",
          pts: ["d['key'] = value to set/update", "d.get('key', default) is safe", "keys(), values(), items() methods", "Dict comprehensions: {k:v for ...}"] },
        { id: "l12", title: "Tuples & Sets", dur: "16 min", vid: "TxS2HGRLSPs",
          overview: "Tuples are immutable lists. Sets are unordered collections of unique elements \u2014 great for deduplication and fast membership testing.",
          pts: ["Tuples: (x, y) \u2014 immutable", "Sets: {1, 2, 3} \u2014 unique only", "union(), intersection(), difference()", "frozenset is an immutable set"] },
      ]
    },
    {
      id: "m5", title: "OOP", emoji: "\uD83C\uDFD7\uFE0F", accent: "#F55B6B", lessons: [
        { id: "l13", title: "Classes & Objects", dur: "25 min", vid: "ZDa-Z5JzLYM",
          overview: "A class is a blueprint; objects are instances. OOP bundles data (attributes) with behavior (methods), modeling real-world entities.",
          pts: ["class MyClass: defines a class", "__init__ is the constructor", "self refers to the instance", "Attributes store per-instance data"] },
        { id: "l14", title: "Inheritance", dur: "22 min", vid: "RSl87lqOXDE",
          overview: "Inheritance lets a subclass reuse and extend a parent class. Models 'is-a' relationships and promotes code reuse.",
          pts: ["class Dog(Animal): inherits Animal", "super().__init__() calls parent", "Override methods to customize", "isinstance() checks the hierarchy"] },
        { id: "l15", title: "Dunder Methods", dur: "18 min", vid: "3ohzBxoFHAY",
          overview: "Special 'dunder' methods customize built-in operations on objects \u2014 print(), len(), ==, +, and more.",
          pts: ["__str__ controls print(obj)", "__len__ controls len(obj)", "__eq__ controls == comparison", "__repr__ gives dev-friendly output"] },
      ]
    },
  ]
};

export const ALL_LESSONS = COURSE.modules.flatMap(m =>
  m.lessons.map(l => ({ ...l, moduleTitle: m.title }))
);

export function getCourseDetails(course) {
  if (!course) return null;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`admin_course_details_${course.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
  }
  if (syllabusesData && syllabusesData[course.id]) {
    return syllabusesData[course.id];
  }
  const normTitle = (course.title || '').toLowerCase();
  const normCat = (course.category || '').toLowerCase();
  const combined = `${normTitle} ${normCat}`;

  if (combined.includes('phys')) {
    return syllabusesData?.['physics-mechanics-fundamentals'];
  }
  if (combined.includes('math') || combined.includes('calc')) {
    return syllabusesData?.['calculus-advanced-mathematics'];
  }
  if (combined.includes('chem')) {
    return syllabusesData?.['general-physical-chemistry'];
  }
  if (combined.includes('bio') || combined.includes('life')) {
    return syllabusesData?.['class-10-biology-2'] || syllabusesData?.['cellular-biology-genetics'];
  }
  if (combined.includes('web') || combined.includes('html') || combined.includes('css')) {
    return syllabusesData?.['modern-web-development-html-css'];
  }
  if (combined.includes('python')) {
    return syllabusesData?.['python-programming-essentials'] || syllabusesData?.['1'] || COURSE;
  }
  return {
    id: course.id,
    title: course.title,
    tagline: `Learn ${course.title} from beginning to mastery with interactive modules.`,
    modules: [
      {
        id: `${course.id}_m1`,
        title: "Introduction & Fundamentals",
        emoji: "🚀",
        accent: T.accent,
        lessons: [
          {
            id: `${course.id}_l1`,
            title: `What is ${course.title}?`,
            dur: "8 min",
            vid: "rfscVS0vtbw",
            overview: `${course.title} is a powerful subject. In this lesson, we will explore its history, applications, and core setup.`,
            pts: ["Understand core definitions", "Learn typical use cases", "Set up your workspace environment"]
          },
          {
            id: `${course.id}_l2`,
            title: "Basic Syntax & Commands",
            dur: "12 min",
            vid: "_uQrJ0TkZlc",
            overview: "Learn the foundational syntax, statements, and writing conventions needed to compile and run your code.",
            pts: ["Understand key operators", "Declare variable assignments", "Write basic input/output statements"]
          }
        ]
      },
      {
        id: `${course.id}_m2`,
        title: "Core Mechanics",
        emoji: "⚙️",
        accent: T.green,
        lessons: [
          {
            id: `${course.id}_l3`,
            title: "Control Logic & Structuring",
            dur: "15 min",
            vid: "DZwmZ8Usvnk",
            overview: "Explore branching statements, loops, and conditions that govern program execution flow.",
            pts: ["Master logical operators", "Handle if/else branching", "Construct stable repeating loops"]
          }
        ]
      }
    ]
  };
}
