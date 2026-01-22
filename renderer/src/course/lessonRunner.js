import { RunnerStatus, emptyProgress } from "./schema";

export function createRunnerState(lessonId, savedProgress) {
  const base = savedProgress || emptyProgress(lessonId);
  return {
    lessonId,
    stepIndex: base.stepIndex || 0,
    status: base.status || RunnerStatus.running,
    pace: base.pace || "normal",
  };
}

export function startLesson(lessonId) {
  return {
    lessonId,
    stepIndex: 0,
    status: RunnerStatus.running,
    pace: "normal",
  };
}

export function pause(state) {
  if (state.status === RunnerStatus.completed) return state;
  return { ...state, status: RunnerStatus.paused };
}

export function resume(state) {
  if (state.status === RunnerStatus.completed) return state;
  return { ...state, status: RunnerStatus.running };
}

export function restart(state) {
  return { ...state, stepIndex: 0, status: RunnerStatus.running };
}

export function nextStep(state, totalSteps) {
  if (state.status === RunnerStatus.completed) return state;
  const nextIndex = Math.min(totalSteps - 1, state.stepIndex + 1);
  const status = nextIndex === totalSteps - 1 ? RunnerStatus.completed : state.status;
  return { ...state, stepIndex: nextIndex, status };
}

export function prevStep(state) {
  if (state.stepIndex === 0) return state;
  return { ...state, stepIndex: state.stepIndex - 1 };
}

export function jumpTo(state, targetIndex, totalSteps) {
  const clamped = Math.max(0, Math.min(totalSteps - 1, targetIndex));
  const status = clamped === totalSteps - 1 ? RunnerStatus.completed : state.status;
  return { ...state, stepIndex: clamped, status };
}

export function setPace(state, pace) {
  return { ...state, pace };
}
