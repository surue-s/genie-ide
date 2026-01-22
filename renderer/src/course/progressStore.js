import { PROGRESS_VERSION, emptyProgress } from "./schema";

const STORAGE_KEY = "genie-course-progress";

function getSafeStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

export function loadProgress() {
  const storage = getSafeStorage();
  if (!storage) return { version: PROGRESS_VERSION, lessons: {} };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { version: PROGRESS_VERSION, lessons: {} };
    const parsed = JSON.parse(raw);
    if (parsed.version !== PROGRESS_VERSION || !parsed.lessons) {
      return { version: PROGRESS_VERSION, lessons: {} };
    }
    return parsed;
  } catch (err) {
    console.warn("Failed to load course progress", err);
    return { version: PROGRESS_VERSION, lessons: {} };
  }
}

export function saveProgress(state) {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to save course progress", err);
  }
}

export function getLessonProgress(progressState, lessonId) {
  return progressState.lessons[lessonId] || emptyProgress(lessonId);
}

export function upsertLessonProgress(progressState, lessonId, partial) {
  const next = { ...progressState.lessons[lessonId], ...partial };
  return {
    version: PROGRESS_VERSION,
    lessons: {
      ...progressState.lessons,
      [lessonId]: {
        ...emptyProgress(lessonId),
        ...next,
        lessonId,
        lastUpdated: Date.now(),
      },
    },
  };
}
