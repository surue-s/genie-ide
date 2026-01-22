import { RunnerStatus } from "../schema";

export default function Controls({ runnerState, onPause, onResume, onRestart, onNext, onPrev, onJump, totalSteps, theme }) {
  const canPrev = runnerState.stepIndex > 0;
  const canNext = runnerState.stepIndex < totalSteps - 1;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        onClick={onPrev}
        disabled={!canPrev}
        style={buttonStyle(theme, !canPrev)}
      >
        Prev
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        style={buttonStyle(theme, !canNext)}
      >
        Next
      </button>
      {runnerState.status === RunnerStatus.running ? (
        <button onClick={onPause} style={buttonStyle(theme)}>
          Pause
        </button>
      ) : (
        <button onClick={onResume} style={buttonStyle(theme)}>
          Resume
        </button>
      )}
      <button onClick={onRestart} style={buttonStyle(theme)}>
        Restart
      </button>
      <select
        value={runnerState.stepIndex}
        onChange={(e) => onJump(Number(e.target.value))}
        style={{
          background: theme.colors.buttonBg,
          color: theme.colors.buttonText,
          border: `1px solid ${theme.colors.borderSubtle}`,
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 13,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <option key={idx} value={idx}>
            Step {idx + 1}
          </option>
        ))}
      </select>
    </div>
  );
}

function buttonStyle(theme, disabled = false) {
  return {
    background: disabled ? theme.colors.buttonBg : theme.colors.buttonBg,
    color: disabled ? theme.colors.textMuted : theme.colors.buttonText,
    border: `1px solid ${theme.colors.borderSubtle}`,
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "background 120ms ease-out",
  };
}
