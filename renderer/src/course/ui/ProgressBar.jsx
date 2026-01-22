export default function ProgressBar({ current, total, theme }) {
  const ratio = total > 0 ? (current / total) : 0;
  return (
    <div style={{ width: "100%", height: 8, background: theme.colors.borderSubtle, borderRadius: 999, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.round(ratio * 100)}%`,
          height: "100%",
          background: theme.colors.accentMint,
          transition: "width 160ms ease-out",
        }}
      />
    </div>
  );
}
