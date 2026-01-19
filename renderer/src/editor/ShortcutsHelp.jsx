import { SHORTCUTS } from "../core/shortcuts";

export default function ShortcutsHelp({ onClose, theme }) {
  const colors = theme.colors;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.bgPanel,
          padding: 24,
          borderRadius: 14,
          border: `1px solid ${colors.borderSubtle}`,
          minWidth: 500,
          maxWidth: 600,
          boxShadow: `0 12px 48px ${colors.shadow}`,
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: colors.textPrimary, fontSize: 18, fontWeight: 600 }}>
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
              transition: 'color 140ms ease-out',
            }}
            onMouseEnter={(e) => e.target.style.color = colors.textPrimary}
            onMouseLeave={(e) => e.target.style.color = colors.textMuted}
          >
            ×
          </button>
        </div>
        
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(SHORTCUTS).map(([key, shortcut]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: `1px solid ${colors.borderSubtle}`,
              }}
            >
              <span style={{ color: colors.textSecondary, fontSize: 14 }}>
                {shortcut.description}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {shortcut.ctrl && (
                  <kbd style={{
                    backgroundColor: colors.buttonBg,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    fontWeight: 600,
                  }}>
                    Ctrl
                  </kbd>
                )}
                {shortcut.shift && (
                  <kbd style={{
                    backgroundColor: colors.buttonBg,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    fontWeight: 600,
                  }}>
                    Shift
                  </kbd>
                )}
                <kbd style={{
                  backgroundColor: colors.buttonBg,
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderSubtle}`,
                  fontWeight: 600,
                }}>
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: 20, 
          padding: 12, 
          backgroundColor: colors.bgPanelAlt, 
          borderRadius: 10, 
          fontSize: 12, 
          color: colors.textSecondary,
          border: `1px solid ${colors.borderSubtle}`,
        }}>
          <strong style={{ color: colors.accentMint }}>Tip:</strong> Press <kbd style={{ 
            backgroundColor: colors.buttonBg, 
            padding: '2px 6px', 
            borderRadius: 4,
            border: `1px solid ${colors.borderSubtle}`,
            color: colors.textPrimary,
            fontWeight: 600,
          }}>?</kbd> anytime to see shortcuts
        </div>
      </div>
    </div>
  );
}
