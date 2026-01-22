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
        text: "JavaScript is the language this editor runs in the browser and Node. We'll write and run it in the center editor and see output in the Output panel.",
      },
      {
        kind: StepKinds.syntax,
        title: "Your first statement",
        code: "console.log('Hello, Genie IDE!');",
        text: "A statement ends with a semicolon. `console.log` prints to the Output panel. Strings use quotes." ,
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Type the console.log above in the editor and press Run. Watch the Output panel.",
      },
      {
        kind: StepKinds.reflection,
        title: "Check understanding",
        prompt: "In your own words: what does a statement do?",
      },
    ],
  },
  {
    id: "foundations-variables",
    levelId: "foundations",
    title: "Variables and values",
    outcomes: [
      "Declare and read variables",
      "Differentiate let vs. const",
      "See how reassignment works",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "Names and boxes",
        text: "Think of variables as labeled boxes. `let` makes a box you can relabel; `const` is a box you promise not to relabel.",
      },
      {
        kind: StepKinds.syntax,
        title: "Basic declarations",
        code: "let count = 1;\nconst name = 'Genie';\ncount = count + 1;",
        text: "Use let for changing values, const for stable bindings. Strings use quotes; numbers don't.",
      },
      {
        kind: StepKinds.question,
        title: "Quick check",
        prompt: "If you need a value that never changes, which keyword?",
      },
      {
        kind: StepKinds.task,
        title: "Try it",
        text: "Make a const called greeting with a string. Make a let called times with a number, then increment it.",
      },
    ],
  },
  {
    id: "core-js-types",
    levelId: "core-js",
    title: "Primitive types",
    outcomes: [
      "Identify strings, numbers, booleans, null, undefined",
      "Use typeof for quick inspection",
    ],
    steps: [
      {
        kind: StepKinds.explain,
        title: "Data building blocks",
        text: "JavaScript has a small set of primitives. Everything else builds on them.",
      },
      {
        kind: StepKinds.syntax,
        title: "Seeing types",
        code: "const label = 'JS';\nconst version = 6 + 6;\nconst ready = true;\nconsole.log(typeof label, typeof version, typeof ready);",
        text: "Use typeof to inspect. Numbers cover ints and floats. Strings are UTF-16 text. Booleans are true/false.",
      },
      {
        kind: StepKinds.task,
        title: "Practice",
        text: "Log the typeof for null and undefined. Notice how null reports as 'object' (a historical quirk).",
      },
    ],
  },
];

export const lessons = lessonsRaw.map(validateLesson);
export const lessonsById = Object.fromEntries(lessons.map((l) => [l.id, l]));

export function lessonsByLevel(levelId) {
  return lessons.filter((l) => l.levelId === levelId);
}
