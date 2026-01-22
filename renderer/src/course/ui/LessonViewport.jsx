export default function LessonViewport({ lesson, runnerState, theme }) {
  const step = lesson.steps[runnerState.stepIndex];

  return (
    <div style={{
      background: theme.colors.bgPanel,
      border: `1px solid ${theme.colors.borderSubtle}`,
      borderRadius: 12,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minHeight: 220,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{step.title}</div>
        <div style={{ fontSize: 12, color: theme.colors.textMuted }}>
          Step {runnerState.stepIndex + 1} / {lesson.steps.length}
        </div>
      </div>

      {step.text && (
        <div style={{ color: theme.colors.textPrimary, lineHeight: 1.5, fontSize: 13 }}>
          {step.text}
        </div>
      )}

      {step.code && (
        <pre
          style={{
            background: theme.colors.surfaceRaised || theme.colors.bgPanel,
            borderRadius: 10,
            padding: 12,
            margin: 0,
            fontSize: 13,
            border: `1px solid ${theme.colors.borderSubtle}`,
            color: theme.colors.textPrimary,
            overflowX: "auto",
          }}
        >
{step.code}
        </pre>
      )}

      {step.prompt && (
        <div style={{
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${theme.colors.borderSubtle}`,
          background: theme.colors.bgPanelAlt || theme.colors.bgPanel,
          color: theme.colors.textPrimary,
          fontSize: 13,
        }}>
          {step.prompt}
        </div>
      )}
    </div>
  );
}
