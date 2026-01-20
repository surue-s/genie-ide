import { useState } from 'react';

export default function ErrorSummaryCard({ error, theme, onLocationClick }) {
  const colors = theme.colors;

  return (
    <div
      style={{
        background: colors.warningBg || colors.bgPanel,
        border: `1px solid ${colors.warningSurface || colors.borderSubtle}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        cursor: onLocationClick ? 'pointer' : 'default',
        transition: 'all 140ms ease-out',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={(e) => {
        if (onLocationClick) {
          e.currentTarget.style.borderColor = colors.accentWarm || colors.accentRose;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.warningSurface || colors.borderSubtle;
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      onClick={onLocationClick}
    >
      {/* Header with icon and title */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Alert icon */}
        <div style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.accentWarm || colors.accentRose,
          marginTop: 2,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          {/* Error name */}
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.textPrimary,
            marginBottom: 4,
          }}>
            {error.errorName}
          </div>

          {/* Summary */}
          <div style={{
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 8,
            lineHeight: 1.4,
          }}>
            {error.summary}
          </div>

          {/* Location (if available) */}
          {error.file && (
            <div style={{
              fontSize: 12,
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>
                {error.file.split('/').pop()}
                {error.line && ` • Line ${error.line}`}
              </span>
              {onLocationClick && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  color: colors.textMuted,
                  fontStyle: 'italic',
                }}>
                  Click to view
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
