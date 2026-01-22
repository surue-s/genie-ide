import { useState, useEffect } from "react";
import { getAvailableThemes } from "../core/theme";

export default function Settings({ 
  isOpen, 
  onClose, 
  uiScale, 
  setUiScale, 
  brightness, 
  setBrightness, 
  contrast, 
  setContrast,
  theme,
  onThemeChange,
  currentTheme,
  fontSize,
  setFontSize
}) {
  const availableThemes = getAvailableThemes();
  const colors = theme?.colors || {
    bgPanel: "#1a1d27",
    textPrimary: "#F1EAF7",
    textSecondary: "#9C8FB4",
    borderSubtle: "#2a2f3d",
    buttonBg: "#2d3242",
    buttonText: "#e0d6eb",
    accentMint: "#4FBFB3",
  };

  // Close settings when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('settings-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="settings-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target.classList.contains('settings-backdrop')) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: 400,
          background: colors.bgPanel,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          color: colors.textPrimary,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: colors.textSecondary,
              fontSize: 20,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 4,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 500 }}>Appearance</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: colors.textSecondary }}>
              Theme
            </label>
            <select
              value={currentTheme}
              onChange={(e) => onThemeChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: colors.buttonBg,
                color: colors.buttonText,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              {availableThemes.map(t => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 500 }}>Display</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: colors.textSecondary }}>
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="20"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                background: colors.buttonBg,
                borderRadius: 10,
                outline: "none",
                border: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: colors.textSecondary }}>
              UI Scale: {Math.round(uiScale * 100)}%
            </label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={uiScale}
              onChange={(e) => setUiScale(parseFloat(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                background: colors.buttonBg,
                borderRadius: 10,
                outline: "none",
                border: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: colors.textSecondary }}>
              Brightness: {Math.round(brightness * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                background: colors.buttonBg,
                borderRadius: 10,
                outline: "none",
                border: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              <span>Darker</span>
              <span>Lighter</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: colors.textSecondary }}>
              Contrast: {Math.round(contrast * 100)}%
            </label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                background: colors.buttonBg,
                borderRadius: 10,
                outline: "none",
                border: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, color: colors.textSecondary }}>
              <span>Softer</span>
              <span>Sharper</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: colors.accentMint,
              color: "#000",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}