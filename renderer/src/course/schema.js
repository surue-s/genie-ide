// Data shapes for the in-IDE JavaScript course.
// Keep this pure-data so future AI tutors can read/augment without refactors.

export const RunnerStatus = {
  idle: "idle",
  running: "running",
  paused: "paused",
  completed: "completed",
};

export const StepKinds = {
  explain: "explain", // concise concept or mental model
  syntax: "syntax",   // line-by-line syntax breakdown
  example: "example", // short editable example
  task: "task",       // user action request
  question: "question", // inline question (MCQ or free-form prompt)
  reflection: "reflection", // prompt to restate in own words
};

export const PaceModes = ["normal", "slow", "fast"];

// Minimal validator to keep content consistent. Throws on obvious mistakes.
export function validateLesson(lesson) {
  if (!lesson || !lesson.id) throw new Error("Lesson must have an id");
  if (!lesson.levelId) throw new Error(`Lesson ${lesson.id} missing levelId`);
  if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) {
    throw new Error(`Lesson ${lesson.id} must have at least one step`);
  }
  lesson.steps.forEach((step, idx) => {
    if (!StepKinds[step.kind]) {
      throw new Error(`Lesson ${lesson.id} step ${idx} has unknown kind ${step.kind}`);
    }
  });
  return lesson;
}

// Progress shape (versioned for safe migrations)
export const PROGRESS_VERSION = 1;

export function emptyProgress(lessonId) {
  return {
    lessonId,
    stepIndex: 0,
    status: RunnerStatus.idle,
    pace: "normal",
    lastUpdated: Date.now(),
  };
}
