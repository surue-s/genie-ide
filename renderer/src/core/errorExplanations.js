/**
 * Error Explanation Database
 * Maps error patterns to beginner-friendly explanations
 * Tone: Patient mentor, non-judgmental, supportive
 */

const errorPatterns = [
  // JavaScript Errors
  {
    pattern: /SyntaxError.*unexpected token/i,
    errorName: 'Syntax Error',
    summary: 'Missing or misplaced punctuation',
    whatHappened: "JavaScript couldn't read your code because something is grammatically wrong. This is like a typo in English—the computer doesn't understand what you meant.",
    whyHappened: [
      'Missing a closing bracket, parenthesis, or curly brace',
      'Forgotten semicolon (in some cases)',
      'Misspelled keyword',
      'Quote mark not closed',
    ],
    howToFix: [
      'Look at the line number the error mentions',
      'Check for matching pairs: { }, ( ), [ ], " ", etc.',
      'Make sure all brackets and parentheses are closed',
      'Look for typos in keywords like `function`, `if`, `const`, etc.',
    ],
  },
  {
    pattern: /ReferenceError.*is not defined/i,
    errorName: 'Undefined Variable',
    summary: 'You used a variable that doesn\'t exist',
    whatHappened: "Your code tried to use a variable that either doesn't exist or hasn't been created yet. It's like asking for a word that wasn't defined.",
    whyHappened: [
      'Variable name is misspelled (e.g., `userName` vs `username`)',
      'Variable was created in a different scope and isn\'t accessible here',
      'Variable was created with `var` or `let` inside a function, but used outside',
      'Forgot to declare the variable with `const`, `let`, or `var`',
    ],
    howToFix: [
      'Check the spelling of the variable name—JavaScript is case-sensitive',
      'Make sure the variable was created before you used it',
      'If the variable is inside a function, use it inside that same function',
      'Try adding `const` or `let` before the variable name if it\'s new',
    ],
  },
  {
    pattern: /TypeError.*is not a function/i,
    errorName: 'Type Error: Not a Function',
    summary: 'You tried to use something as a function that isn\'t one',
    whatHappened: 'Your code tried to call something with parentheses ( ) that isn\'t a function. Like trying to run something that isn\'t meant to run.',
    whyHappened: [
      'Variable name is misspelled, so it refers to something else entirely',
      'Variable holds a string, number, or object—not a function',
      'Forgot parentheses ( ) when calling a function',
      'Trying to call a function before it\'s defined',
    ],
    howToFix: [
      'Check the spelling of the function name',
      'Make sure you\'re using ( ) with the function name',
      'If it\'s a method on an object, use dot notation: `object.method()`',
      'If the function is defined later in the file, move the definition above where you use it',
    ],
  },
  {
    pattern: /TypeError.*Cannot read propert|Cannot read properties/i,
    errorName: 'Undefined Property',
    summary: 'You tried to access a property that doesn\'t exist',
    whatHappened: 'Your code tried to access a property on something that either doesn\'t have that property or is null/undefined. Like looking for a door that isn\'t there.',
    whyHappened: [
      'Object doesn\'t have that property',
      'Property name is misspelled',
      'Trying to access a property on `null` or `undefined`',
      'Array or object isn\'t what you think it is',
    ],
    howToFix: [
      'Check the property name for spelling and case sensitivity',
      'Use `console.log()` to see what the object actually contains',
      'Add a check: `if (object && object.property) { ... }`',
      'Verify the object exists and isn\'t null or undefined',
    ],
  },
  {
    pattern: /TypeError.*split is not a function|Cannot read.*split/i,
    errorName: 'String Method Error',
    summary: 'You tried to use a string method on something that isn\'t a string',
    whatHappened: 'You used a string method (like `.split()`, `.slice()`, etc.) on something that isn\'t a string. Methods only work on the right data types.',
    whyHappened: [
      'Variable is a number, not a string',
      'Variable is an array or object, not a string',
      'Variable is null or undefined',
    ],
    howToFix: [
      'Convert the variable to a string first: `String(variable)`',
      'Or convert it: `variable.toString()`',
      'Check what type the variable is with `console.log(typeof variable)`',
      'Make sure you\'re working with a string before calling string methods',
    ],
  },
  {
    pattern: /RangeError.*Invalid array length|Invalid string length/i,
    errorName: 'Value Out of Range',
    summary: 'A number is too large or too small',
    whatHappened: 'You tried to create an array or string with a number that\'s too big, too small, or not a whole number.',
    whyHappened: [
      'Creating an array with a negative number',
      'Creating an array with a decimal number',
      'Creating an array with a number that\'s way too large',
    ],
    howToFix: [
      'Use a positive, whole number (integer) for array size',
      'If you need to create an array from a list, use `[item1, item2, item3]` instead',
      'Check the number you\'re using: `Math.floor()` removes decimals, `Math.abs()` makes it positive',
    ],
  },

  // Python Errors
  {
    pattern: /SyntaxError|IndentationError/i,
    errorName: 'Syntax or Indentation Error',
    summary: 'Something is wrong with how the code is formatted',
    whatHappened: 'Python couldn\'t understand your code because of spacing, formatting, or punctuation. Python cares a lot about indentation (spaces).',
    whyHappened: [
      'Indentation (spaces) is inconsistent or missing',
      'Colon (:) is missing after `if`, `for`, `def`, etc.',
      'Unmatched parentheses or brackets',
    ],
    howToFix: [
      'Check that code inside blocks (functions, loops, conditions) is indented with spaces',
      'Make sure there\'s a colon (:) at the end of lines with `if`, `for`, `while`, `def`, etc.',
      'Use consistent spacing—don\'t mix tabs and spaces',
      'Count parentheses and brackets to make sure they match',
    ],
  },
  {
    pattern: /NameError.*is not defined/i,
    errorName: 'Name Not Defined',
    summary: 'You used a variable that doesn\'t exist',
    whatHappened: 'Your code tried to use a variable that either doesn\'t exist or wasn\'t created yet.',
    whyHappened: [
      'Variable name is misspelled',
      'Variable was created in a different function and isn\'t accessible here',
      'You forgot to create the variable with an assignment',
    ],
    howToFix: [
      'Check the spelling of the variable name—Python is case-sensitive',
      'Make sure the variable is created before you use it',
      'Create it with: `variable_name = value`',
    ],
  },
  {
    pattern: /TypeError|AttributeError/i,
    errorName: 'Type or Attribute Error',
    summary: 'You used the wrong type of data or a method that doesn\'t exist',
    whatHappened: 'Your code tried to do something with data that\'s the wrong type, or called a method that doesn\'t exist on that data.',
    whyHappened: [
      'Trying to add a string and a number together',
      'Calling a method that doesn\'t exist on this type of data',
      'Using the wrong method for this data type',
    ],
    howToFix: [
      'Check the data type: use `type(variable)` to see what it is',
      'Convert data if needed: `str(number)`, `int(string)`, etc.',
      'Look up the correct method name for this data type',
      'Use `print()` and `type()` to debug what you\'re working with',
    ],
  },
  {
    pattern: /KeyError/i,
    errorName: 'Dictionary Key Missing',
    summary: 'You tried to access a key that doesn\'t exist in a dictionary',
    whatHappened: 'Your code tried to find a key in a dictionary (like a lookup table) that doesn\'t exist.',
    whyHappened: [
      'Key name is misspelled',
      'Key doesn\'t exist in the dictionary',
      'Using wrong data type for the key',
    ],
    howToFix: [
      'Check the exact spelling and format of the key',
      'Use `.get()` method instead: `dictionary.get("key", "default value")`',
      'Check if the key exists first: `if "key" in dictionary:`',
      'Print the dictionary to see what keys actually exist: `print(dictionary.keys())`',
    ],
  },
  {
    pattern: /IndexError|list index out of range/i,
    errorName: 'Index Out of Bounds',
    summary: 'You tried to access an item in a list that doesn\'t exist',
    whatHappened: 'Your code tried to get an item from a list using a number that\'s too high or too low.',
    whyHappened: [
      'List has 3 items (0, 1, 2) but you asked for item 5',
      'Using a negative number that\'s too far back',
      'Forgot that lists start at 0, not 1',
    ],
    howToFix: [
      'Remember: lists start at 0, so a 3-item list has indices 0, 1, 2',
      'Check the length: `len(my_list)` tells you how many items',
      'Use `if index < len(list):` to check before accessing',
      'Use negative indexing: `-1` for the last item, `-2` for second-to-last',
    ],
  },
  {
    pattern: /FileNotFoundError|IOError/i,
    errorName: 'File Not Found',
    summary: 'Your code tried to open a file that doesn\'t exist',
    whatHappened: 'Python looked for a file but couldn\'t find it. Check the file path and spelling.',
    whyHappened: [
      'File path is wrong or misspelled',
      'File doesn\'t exist in that location',
      'Using relative path when absolute path is needed (or vice versa)',
    ],
    howToFix: [
      'Check the file path and spelling carefully',
      'Make sure the file exists in that folder',
      'Print the file path to debug: `print(file_path)`',
      'Use absolute paths if relative paths don\'t work',
    ],
  },

  // Generic/Fallback
  {
    pattern: /Error/i,
    errorName: 'Runtime Error',
    summary: 'Something went wrong while running the code',
    whatHappened: 'Your code ran into a problem while executing. Look at the error message for more details.',
    whyHappened: [
      'Logic error in your code',
      'Unexpected data or input',
      'Resource issue (file, memory, etc.)',
    ],
    howToFix: [
      'Read the error message carefully—it often tells you exactly what went wrong',
      'Find the line number mentioned and check that code',
      'Use `console.log()` or `print()` to see what your variables contain',
      'Try a simpler version of the code to narrow down the problem',
    ],
  },
];

/**
 * Parse error text and return structured error data
 * @param {string} errorText - Raw error output
 * @returns {Object} Structured error data or null if no match
 */
export function parseError(errorText) {
  if (!errorText || typeof errorText !== 'string') return null;

  // Try to find a matching error pattern
  for (const pattern of errorPatterns) {
    if (pattern.pattern.test(errorText)) {
      // Extract file and line number if possible
      const fileMatch = errorText.match(/(?:at |in |File ")(.*?)(?:",|:|$)/);
      const lineMatch = errorText.match(/:(\d+):|line (\d+)/);

      return {
        errorName: pattern.errorName,
        summary: pattern.summary,
        whatHappened: pattern.whatHappened,
        whyHappened: pattern.whyHappened,
        howToFix: pattern.howToFix,
        file: fileMatch ? fileMatch[1] : null,
        line: lineMatch ? parseInt(lineMatch[1] || lineMatch[2]) : null,
        rawError: errorText,
      };
    }
  }

  return null;
}

/**
 * Extract just the error message (first line usually)
 * @param {string} errorText - Raw error output
 * @returns {string} First meaningful line of error
 */
export function getErrorFirstLine(errorText) {
  if (!errorText) return 'Unknown error';
  const lines = errorText.split('\n').filter(l => l.trim());
  return lines[0] || 'Unknown error';
}
