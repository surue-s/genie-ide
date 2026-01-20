import { useRef, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

export default function MusicPlayerPanel({ isOpen, onClose, theme }) {
  const panelRef = useRef(null);
  const colors = theme.colors;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking outside panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && isOpen) {
        // Don't close if clicking the music button (handled by parent toggle)
        const isMusicButton = e.target.closest('[data-music-button]');
        if (!isMusicButton) {
          // onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop (optional fade) */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.15)',
            zIndex: 999,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 200ms ease-out',
          }}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 60,
          right: 20,
          width: 340,
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          background: colors.bgPanel,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px',
          borderBottom: `1px solid ${colors.borderSubtle}`,
          gap: 12,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.accentMint }}>
              <circle cx="12" cy="12" r="8"/>
              <polyline points="12 9 12 12 14 14"/>
              <path d="M21.3 13a9 9 0 1 0-6.3 6"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
              Ambient Music
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: 'none',
              color: colors.textMuted,
              cursor: 'pointer',
              transition: 'all 140ms ease-out',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.buttonBg;
              e.target.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = colors.textMuted;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Player */}
        <MusicPlayer theme={theme} />
      </div>
    </>
  );
}
