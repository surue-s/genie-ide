import { SHORTCUTS } from "../core/shortcuts";

export default function ShortcutsHelp({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e1e1e',
          padding: 24,
          borderRadius: 8,
          border: '1px solid #3a3d45',
          minWidth: 500,
          maxWidth: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18 }}>
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
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
                padding: '8px 0',
                borderBottom: '1px solid #2a2d35',
              }}
            >
              <span style={{ color: '#ccc', fontSize: 14 }}>
                {shortcut.description}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {shortcut.ctrl && (
                  <kbd style={{
                    backgroundColor: '#2a2d35',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#fff',
                    border: '1px solid #3a3d45',
                  }}>
                    Ctrl
                  </kbd>
                )}
                {shortcut.shift && (
                  <kbd style={{
                    backgroundColor: '#2a2d35',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#fff',
                    border: '1px solid #3a3d45',
                  }}>
                    Shift
                  </kbd>
                )}
                <kbd style={{
                  backgroundColor: '#2a2d35',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#fff',
                  border: '1px solid #3a3d45',
                }}>
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: 12, backgroundColor: '#0E0F13', borderRadius: 4, fontSize: 12, color: '#888' }}>
          <strong style={{ color: '#48bb78' }}>Tip:</strong> Press <kbd style={{ backgroundColor: '#2a2d35', padding: '2px 6px', borderRadius: 2 }}>?</kbd> anytime to see shortcuts
        </div>
      </div>
    </div>
  );
}
