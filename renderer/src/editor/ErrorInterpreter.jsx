import { useState } from 'react';
import ErrorSummaryCard from './ErrorSummaryCard';

export default function ErrorInterpreter({ error, theme, onLocationClick }) {
  const [expandedSections, setExpandedSections] = useState({
    what: true,
    why: false,
    how: false,
  });

  const colors = theme.colors;

  if (!error) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      paddingBottom: 16,
    }}>
      {/* Error Summary Card */}
      <ErrorSummaryCard 
        error={error} 
        theme={theme}
        onLocationClick={onLocationClick}
      />

      {/* Explanation Sections */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* What Happened */}
        <ExpandableSection
          title="What happened?"
          isExpanded={expandedSections.what}
          onToggle={() => toggleSection('what')}
          content={error.whatHappened}
          theme={theme}
        />

        {/* Why This Happened */}
        <ExpandableSection
          title="Why this happened"
          isExpanded={expandedSections.why}
          onToggle={() => toggleSection('why')}
          content={error.whyHappened}
          isList={true}
          theme={theme}
        />

        {/* How to Fix It */}
        <ExpandableSection
          title="How to fix it (step-by-step)"
          isExpanded={expandedSections.how}
          onToggle={() => toggleSection('how')}
          content={error.howToFix}
          isList={true}
          isSteps={true}
          theme={theme}
        />
      </div>

      {/* Learning Tips */}
      <div style={{
        background: colors.bgPanelAlt,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 10,
        padding: 12,
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 1.5,
        marginTop: 8,
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
            color: colors.accentMint,
            marginTop: 1,
            flexShrink: 0,
          }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 16 16 12 12 8"/>
            <polyline points="8 12 12 16 16 12"/>
          </svg>
          <span>
            Errors are normal—they're your code's way of telling you something needs fixing. Read the error message carefully, and you'll learn something new.
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Expandable section component for error details
 */
function ExpandableSection({ title, isExpanded, onToggle, content, isList, isSteps, theme }) {
  const colors = theme.colors;

  return (
    <div style={{
      border: `1px solid ${colors.borderSubtle}`,
      borderRadius: 10,
      overflow: 'hidden',
      background: colors.bgPanel,
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
          transition: 'all 140ms ease-out',
          color: colors.textPrimary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.buttonBgHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'left',
        }}>
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 150ms ease-out',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            color: colors.textSecondary,
          }}
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Content */}
      <div style={{
        maxHeight: isExpanded ? '1000px' : 0,
        overflow: 'hidden',
        transition: 'max-height 200ms ease-out',
        borderTop: isExpanded ? `1px solid ${colors.borderSubtle}` : 'none',
      }}>
        <div style={{
          padding: '12px 14px',
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 1.6,
        }}>
          {isList ? (
            <ul style={{
              margin: 0,
              paddingLeft: isSteps ? 0 : 20,
              display: isSteps ? 'flex' : 'block',
              flexDirection: isSteps ? 'column' : 'row',
              gap: isSteps ? 8 : 0,
            }}>
              {content.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    listStyle: isSteps ? 'none' : 'disc',
                    marginBottom: isSteps ? 0 : 6,
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  {isSteps && (
                    <span style={{
                      fontWeight: 600,
                      color: colors.accentMint,
                      minWidth: 20,
                      flexShrink: 0,
                    }}>
                      {idx + 1}.
                    </span>
                  )}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
