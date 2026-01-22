// Maps runtime/syntax errors to relevant course lessons.
// This is a data layer; actual error hooking comes later.

export const errorLessonMap = {
  // Syntax errors
  "SyntaxError": {
    lessonIds: ["foundations-hello-js"],
    message: "It looks like there's a typo in your code. Check for missing semicolons, quotes, or brackets.",
  },
  "Unexpected token": {
    lessonIds: ["foundations-hello-js"],
    message: "JavaScript didn't recognize this word or symbol. Are all quotes and brackets balanced?",
  },

  // Variable errors
  "undefined": {
    lessonIds: ["foundations-variables"],
    message: "This variable doesn't exist yet or hasn't been given a value. Check the spelling and make sure you declared it first.",
  },
  "ReferenceError": {
    lessonIds: ["foundations-variables"],
    message: "You're using a variable that doesn't exist. Did you forget to declare it with let or const?",
  },

  // Type errors
  "is not a function": {
    lessonIds: ["core-js-types"],
    message: "You're trying to call something that isn't a function. Check what type of value it actually is.",
  },
  "Cannot read properties": {
    lessonIds: ["core-js-types"],
    message: "You're trying to access something that doesn't exist on this value. Are you using the right method?",
  },

  // Number errors
  "Cannot convert": {
    lessonIds: ["core-js-numbers"],
    message: "You're mixing types in a way JavaScript can't figure out. Numbers and text need careful handling.",
  },

  // Boolean/comparison errors
  "is not equal": {
    lessonIds: ["core-js-booleans"],
    message: "Check your comparison. Are you comparing the right types? Use === to check both value and type.",
  },
};

// Safe lookup: returns lesson recommendation or null
export function getLessonForError(errorMessage) {
  if (!errorMessage || typeof errorMessage !== "string") return null;

  // Try exact match first
  if (errorLessonMap[errorMessage]) return errorLessonMap[errorMessage];

  // Try substring match
  for (const [key, value] of Object.entries(errorLessonMap)) {
    if (errorMessage.includes(key)) return value;
  }

  return null;
}
