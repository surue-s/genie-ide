import { useState } from "react";

// File rename modal component
export default function FileRenameModal({ document, onRename, onClose, theme }) {
  const [newName, setNewName] = useState(document.title);
  const [error, setError] = useState("");
  
  const colors = theme.colors;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError("Filename cannot be empty");
      return;
    }
    
    if (!/\.[a-z]+$/i.test(newName)) {
      setError("Please include a file extension (e.g., .js, .py)");
      return;
    }
    
    onRename(document.id, newName);
    onClose();
  };

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
          minWidth: 400,
          boxShadow: `0 12px 48px ${colors.shadow}`,
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 16, color: colors.textPrimary, fontSize: 16, fontWeight: 600 }}>
          Rename File
        </h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: colors.bgPanelAlt,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: 10,
              color: colors.textPrimary,
              fontSize: 14,
              outline: 'none',
              marginBottom: 8,
              transition: 'border-color 140ms ease-out',
            }}
            onFocus={(e) => e.target.style.borderColor = colors.borderFocus}
            onBlur={(e) => e.target.style.borderColor = colors.borderSubtle}
          />
          
          {error && (
            <div style={{ 
              color: colors.error, 
              fontSize: 12, 
              marginBottom: 12,
              padding: '8px 10px',
              backgroundColor: `${colors.error}20`,
              borderRadius: 8,
              border: `1px solid ${colors.error}`,
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.buttonBg,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: 10,
                color: colors.buttonText,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 140ms ease-out',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.buttonBgHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.buttonBg}
              onFocus={(e) => e.target.style.boxShadow = colors.focusRing}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: colors.success,
                border: 'none',
                borderRadius: 10,
                color: colors.buttonText,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 140ms ease-out',
              }}
              onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              onFocus={(e) => e.target.style.boxShadow = colors.focusRing}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
