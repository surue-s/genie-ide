import React from 'react';

// PanelHeader - Consistent header component for all panels
export default function PanelHeader({ icon, title, actions, theme }) {
  const isDark = theme?.type === 'dark';
  const colors = isDark ? {
    bg: '#1F1830',
    border: '#3A2D57',
    text: '#C9BEDA',
    textMuted: '#9C8FB4',
  } : {
    bg: '#F5F2F7',
    border: '#E0DBE5',
    text: '#5A4F6B',
    textMuted: '#8C7FA3',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        height: 44,
        minHeight: 44,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <div style={{ color: colors.text, display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
        <span style={{
          color: colors.text,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          {title}
        </span>
      </div>
      
      {actions && (
        <div style={{ display: 'flex', gap: 6 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
