import { useState, useRef, useEffect } from 'react';
import { getAvailableThemes } from '../core/theme';

export default function ThemeControl({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const themes = getAvailableThemes();

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    
    function handleClickOutside(e) {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const selectedTheme = themes.find(t => t.key === currentTheme) || themes[0];
  const isDark = selectedTheme.type === 'dark';

  const colors = isDark ? {
    buttonBg: '#2B2142',
    buttonBgHover: '#342652',
    buttonText: '#F1EAF7',
    borderSubtle: '#3A2D57',
    borderFocus: '#63D2C6',
    menuBg: '#241C38',
    menuBorder: '#3A2D57',
    shadow: 'rgba(0,0,0,0.35)',
    hoverBg: '#2B2142',
    selectedBg: 'rgba(255,111,174,0.16)',
    selectedBorder: '#FF6FAE',
    textPrimary: '#F1EAF7',
    textMuted: '#9C8FB4',
  } : {
    buttonBg: '#EFEDF1',
    buttonBgHover: '#E5E2E8',
    buttonText: '#2B1F3A',
    borderSubtle: '#E0DBE5',
    borderFocus: '#4FBFB3',
    menuBg: '#FFFFFF',
    menuBorder: '#E0DBE5',
    shadow: 'rgba(43,31,58,0.12)',
    hoverBg: '#F5F2F7',
    selectedBg: 'rgba(232,85,141,0.12)',
    selectedBorder: '#E8558D',
    textPrimary: '#2B1F3A',
    textMuted: '#8C7FA3',
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: colors.buttonBg,
          border: `1px solid ${colors.borderSubtle}`,
          color: colors.buttonText,
          padding: '8px 14px',
          cursor: 'pointer',
          borderRadius: '10px',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 140ms ease-out',
          height: 36,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = colors.buttonBgHover}
        onMouseLeave={(e) => e.currentTarget.style.background = colors.buttonBg}
        onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.borderFocus}40`}
        onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Palette icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
          <path d="M8 14c1.5 2 4.5 2 6 0"/>
        </svg>
        <span>Theme</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            background: colors.menuBg,
            border: `1px solid ${colors.menuBorder}`,
            borderRadius: 12,
            minWidth: 200,
            boxShadow: `0 8px 24px ${colors.shadow}`,
            zIndex: 1000,
            overflow: 'hidden',
          }}
          onKeyDown={handleKeyDown}
        >
          {themes.map((theme) => {
            const isSelected = theme.key === currentTheme;
            
            return (
              <button
                key={theme.key}
                role="menuitem"
                onClick={() => {
                  onThemeChange(theme.key);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 14px',
                  background: isSelected ? colors.selectedBg : 'transparent',
                  border: 'none',
                  borderLeft: isSelected ? `3px solid ${colors.selectedBorder}` : '3px solid transparent',
                  color: colors.textPrimary,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  textAlign: 'left',
                  transition: 'all 120ms ease-out',
                  height: 40,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = colors.hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Theme preview swatches */}
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: theme.preview.background,
                    border: `1px solid ${theme.preview.border}`,
                  }} />
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: theme.preview.accent,
                    border: `1px solid ${theme.preview.border}`,
                  }} />
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: theme.preview.textPrimary,
                    border: `1px solid ${theme.preview.border}`,
                  }} />
                </div>
                
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
