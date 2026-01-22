import { useEffect, useMemo, useState } from "react";
import { levels, lessons, lessonsById, lessonsByLevel } from "../content";
import { RunnerStatus } from "../schema";
import { loadProgress, saveProgress, getLessonProgress, upsertLessonProgress } from "../progressStore";
import { createRunnerState, startLesson, pause, resume, restart, nextStep, prevStep, jumpTo, setPace } from "../lessonRunner";
import ProgressBar from "./ProgressBar";
import Controls from "./Controls";
import LessonViewport from "./LessonViewport";

export default function CoursePanel({ isOpen, onClose, theme }) {
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeLessonId, setActiveLessonId] = useState(() => lessons[0]?.id);
  const [runnerState, setRunnerState] = useState(() => createRunnerState(lessons[0]?.id, getLessonProgress(progress, lessons[0]?.id)));

  const activeLesson = useMemo(() => lessonsById[activeLessonId] || lessons[0], [activeLessonId]);
  const levelLessons = useMemo(() => lessonsByLevel(activeLesson?.levelId), [activeLesson]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // When lesson changes, load its stored progress
  useEffect(() => {
    if (!activeLesson) return;
    const stored = getLessonProgress(progress, activeLesson.id);
    setRunnerState(createRunnerState(activeLesson.id, stored));
  }, [activeLessonId]);

  if (!isOpen) return null;

  const totalSteps = activeLesson.steps.length;
  const percent = Math.round(((runnerState.stepIndex + 1) / totalSteps) * 100);

  const updateProgress = (nextRunner) => {
    setRunnerState(nextRunner);
    setProgress((prev) => upsertLessonProgress(prev, activeLesson.id, nextRunner));
  };

  return (
    <div
      style={{
        width: 340,
        background: theme.colors.bgPanel,
        borderLeft: `1px solid ${theme.colors.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 14px",
        borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>JavaScript Course</div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            fontSize: 18,
          }}
          aria-label="Close course panel"
        >
          ×
        </button>
      </div>

      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={activeLesson?.levelId}
            onChange={(e) => {
              const newLevel = e.target.value;
              const firstLesson = lessonsByLevel(newLevel)[0];
              if (firstLesson) {
                setActiveLessonId(firstLesson.id);
              }
            }}
            style={selectStyle(theme)}
          >
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>{lvl.title}</option>
            ))}
          </select>
          <select
            value={activeLesson?.id}
            onChange={(e) => setActiveLessonId(e.target.value)}
            style={{ ...selectStyle(theme), flex: 1 }}
          >
            {levelLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ProgressBar current={runnerState.stepIndex + 1} total={totalSteps} theme={theme} />
          <div style={{ fontSize: 12, color: theme.colors.textMuted, minWidth: 48, textAlign: "right" }}>{percent}%</div>
        </div>

        <LessonViewport lesson={activeLesson} runnerState={runnerState} theme={theme} />

        <Controls
          runnerState={runnerState}
          totalSteps={totalSteps}
          onPause={() => updateProgress(pause(runnerState))}
          onResume={() => updateProgress(resume(runnerState))}
          onRestart={() => updateProgress(restart(runnerState))}
          onNext={() => updateProgress(nextStep(runnerState, totalSteps))}
          onPrev={() => updateProgress(prevStep(runnerState))}
          onJump={(idx) => updateProgress(jumpTo(runnerState, idx, totalSteps))}
          theme={theme}
        />

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: theme.colors.textMuted }}>Pace</div>
          <select
            value={runnerState.pace}
            onChange={(e) => updateProgress(setPace(runnerState, e.target.value))}
            style={selectStyle(theme)}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <div style={{
          border: `1px dashed ${theme.colors.borderSubtle}`,
          borderRadius: 10,
          padding: 12,
          fontSize: 12,
          color: theme.colors.textSecondary,
          lineHeight: 1.4,
        }}>
          Highlights & locking are off by default for safety. Once we validate the flow, we can enable them without changing this panel's API.
        </div>
      </div>
    </div>
  );
}

function selectStyle(theme) {
  return {
    background: theme.colors.buttonBg,
    color: theme.colors.buttonText,
    border: `1px solid ${theme.colors.borderSubtle}`,
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 13,
  };
}
