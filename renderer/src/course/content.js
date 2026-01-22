import { StepKinds, validateLesson } from "./schema";

export const levels = [
  { id: "foundations", title: "Foundations (absolute beginner)" },
  { id: "core-js", title: "Core JavaScript" },
  { id: "thinking", title: "Program Structure & Thinking" },
];

// Early skeleton lessons. Content is concise to keep UI readable; more depth can be added iteratively.
const lessonsRaw = [
  {
    id: "foundations-hello-js",
    levelId: "foundations",
    title: "What is JavaScript?",
    outcomes: [
      "See where JS runs and what it controls",
      "Understand files vs. scripts vs. environments",
      "Run your first console log",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "JavaScript in this IDE",
        text: "JavaScript is the language this editor runs. We'll write code in the center editor and see output in the Output panel. Every time you press Run, the code executes.",
      },
      {
        kind: StepKinds.syntax,
        title: "Your first statement",
        code: "console.log('Hello, Genie IDE!');",
        text: "A statement ends with a semicolon. `console.log(...)` prints to the Output panel. Text in quotes is a string." ,
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Copy the code above into the editor and press Run. Watch the Output panel at the bottom.",
      },
      {
        kind: StepKinds.reflection,
        title: "Check understanding",
        prompt: "In your own words: what does console.log do?",
      },
    ],
  },
  {
    id: "foundations-variables",
    levelId: "foundations",
    title: "Variables: boxes for values",
    outcomes: [
      "Declare and read variables",
      "Differentiate let vs. const",
      "See how reassignment works",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "Names and boxes",
        text: "Think of variables as labeled boxes. You store a value in the box, then use the label to get it back. `let` makes a box you can relabel; `const` is a box you promise not to change.",
      },
      {
        kind: StepKinds.syntax,
        title: "Declaring with let and const",
        code: "let count = 1;\nconst name = 'Genie';\ncount = 2;\nconsole.log(count, name);",
        text: "With let, you can reassign. With const, you can't change the value after creation. Both are labels, not addresses." ,
      },
      {
        kind: StepKinds.question,
        title: "Quick check",
        prompt: "If you want a value that never changes, which keyword do you use?",
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Make a const greeting = 'Hello'. Make a let count = 1. Then increment count by 1 and log both.",
      },
      {
        kind: StepKinds.reflection,
        title: "Reflect",
        prompt: "Why might const be the default choice for most values?",
      },
    ],
  },
  {
    id: "foundations-strings",
    levelId: "foundations",
    title: "Strings: text and concatenation",
    outcomes: [
      "Write and combine strings",
      "Escape special characters",
      "Use template literals for clarity",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "Text is a string",
        text: "Strings are sequences of characters wrapped in quotes. JavaScript treats 'text' and \"text\" the same. Use template literals (backticks) for easier multi-line and embedded values.",
      },
      {
        kind: StepKinds.syntax,
        title: "Creating and combining strings",
        code: "const greeting = 'Hello';\nconst name = 'World';\nconst message = greeting + ', ' + name + '!';\nconst modern = `${greeting}, ${name}!`;\nconsole.log(message);\nconsole.log(modern);",
        text: "The + operator joins strings. Backtick template literals let you embed values with ${variable}.",
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Create a const with your name. Use a template literal to log 'Hi [name], welcome to coding!'",
      },
    ],
  },
  {
    id: "core-js-types",
    levelId: "core-js",
    title: "Primitive types: the building blocks",
    outcomes: [
      "Identify strings, numbers, booleans, null, undefined",
      "Use typeof to inspect types",
      "Understand type coercion basics",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "Data building blocks",
        text: "JavaScript has a small set of primitives: strings (text), numbers (ints and decimals), booleans (true/false), null, and undefined. Everything else builds on them.",
      },
      {
        kind: StepKinds.syntax,
        title: "Using typeof",
        code: "const label = 'JS';\nconst version = 12;\nconst ready = true;\nconst empty = null;\nconst notYet = undefined;\nconsole.log(typeof label);\nconsole.log(typeof version);\nconsole.log(typeof ready);",
        text: "Use typeof to ask: what is the type of this value? Note: typeof null is 'object' (a historical quirk).",
      },
      {
        kind: StepKinds.question,
        title: "Type check",
        prompt: "What will typeof true return?",
      },
      {
        kind: StepKinds.task,
        title: "Practice",
        text: "Create three variables: one string, one number, one boolean. Log all their types.",
      },
    ],
  },
  {
    id: "core-js-numbers",
    levelId: "core-js",
    title: "Numbers: math and precision",
    outcomes: [
      "Perform arithmetic with +, -, *, /, %",
      "Understand operator precedence",
      "Know JavaScript's quirks with floats",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "JavaScript treats all numbers the same",
        text: "Unlike many languages, JavaScript has one number type for integers and decimals. Math operators are intuitive: +, -, *, /, and % (remainder).",
      },
      {
        kind: StepKinds.syntax,
        title: "Basic arithmetic",
        code: "console.log(2 + 3);      // Addition: 5\nconsole.log(10 - 4);    // Subtraction: 6\nconsole.log(3 * 4);     // Multiplication: 12\nconsole.log(10 / 2);    // Division: 5\nconsole.log(10 % 3);    // Remainder: 1",
        text: "Operations follow math order: multiply and divide first, then add and subtract. Use parentheses to change: (2 + 3) * 4.",
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Calculate: (5 + 3) * 2. Log the result. Then try 20 / 3 and see the decimal.",
      },
    ],
  },
  {
    id: "core-js-booleans",
    levelId: "core-js",
    title: "Booleans: true or false",
    outcomes: [
      "Use comparison operators",
      "Combine booleans with && and ||",
      "Understand truthiness",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "True and false are decisions",
        text: "Booleans are the result of questions: Is 5 greater than 3? Yes (true). Is 'hello' equal to 'hi'? No (false). Comparisons always return a boolean.",
      },
      {
        kind: StepKinds.syntax,
        title: "Comparison operators",
        code: "console.log(5 > 3);      // true\nconsole.log(5 < 3);      // false\nconsole.log(5 === 5);    // true (exactly equal)\nconsole.log(5 === '5');   // false (different type)\nconsole.log(5 !== 3);    // true (not equal)",
        text: "Use >, <, >=, <= to compare. Use === for exact equality (value AND type). Avoid == (loose equality causes confusion).",
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Log the result of: 10 > 5, 10 === '10', 5 === 5",
      },
    ],
  },
];

export const lessons = lessonsRaw.map(validateLesson);
export const lessonsById = Object.fromEntries(lessons.map((l) => [l.id, l]));

export function lessonsByLevel(levelId) {
  return lessons.filter((l) => l.levelId === levelId);
}
