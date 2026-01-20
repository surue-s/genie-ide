/**
 * Error Highlighting System
 * Provides soft, non-intrusive visual indicators in the editor
 * No code modification, purely visual
 */

/**
 * Create a Monaco editor decoration for error highlighting
 * @param {number} lineNumber - Line number to highlight (1-based)
 * @param {Object} theme - Theme object
 * @returns {Object} Monaco decoration configuration
 */
export function createErrorDecoration(lineNumber, theme) {
  const colors = theme.colors;

  return {
    range: new (window.monaco?.Range || (() => {}))(lineNumber, 1, lineNumber, 1),
    options: {
      isWholeLine: true,
      className: 'error-line-highlight',
      glyphMarginClassName: 'error-glyph-margin',
      glyphMarginHoverMessage: [{ value: 'Error on this line' }],
      // Subtle background tint
      backgroundColor: colors.warningBgLight || `${colors.accentWarm || colors.accentRose}15`,
      // Soft border (muted, not aggressive)
      borderColor: `${colors.accentWarm || colors.accentRose}40`,
      borderWidth: '1px',
      borderStyle: 'solid',
    },
  };
}

/**
 * Create a gutter decoration (soft indicator, not aggressive)
 * @param {number} lineNumber - Line number
 * @param {Object} theme - Theme object
 * @returns {Object} Monaco decoration for gutter
 */
export function createGutterDecoration(lineNumber, theme) {
  const colors = theme.colors;

  return {
    range: new (window.monaco?.Range || (() => {}))(lineNumber, 1, lineNumber, 1),
    options: {
      glyphMarginClassName: 'codicon codicon-error',
      glyphMarginBackgroundColor: `${colors.accentWarm || colors.accentRose}20`,
      glyphMarginHoverMessage: [{ 
        value: 'An error occurred on this line. Check the Output panel for details.' 
      }],
    },
  };
}

/**
 * Create inline message decoration
 * @param {number} lineNumber - Line number
 * @param {string} message - Error message
 * @param {Object} theme - Theme object
 * @returns {Object} Monaco decoration
 */
export function createInlineMessage(lineNumber, message, theme) {
  const colors = theme.colors;

  return {
    range: new (window.monaco?.Range || (() => {}))(lineNumber, 1, lineNumber, 1),
    options: {
      isWholeLine: true,
      linesDecorationsClassName: 'error-inline-message',
      after: {
        content: `   ⚠ ${message}`,
        color: colors.accentWarm || colors.accentRose,
        backgroundColor: `${colors.accentWarm || colors.accentRose}10`,
        margin: '0 0 0 10px',
        borderRadius: '4px',
        padding: '2px 4px',
      },
    },
  };
}

/**
 * Soft underline decoration (alternative to line highlight)
 * @param {number} lineNumber - Line number
 * @param {Object} theme - Theme object
 * @returns {Object} Monaco decoration
 */
export function createSoftUnderline(lineNumber, theme) {
  const colors = theme.colors;

  return {
    range: new (window.monaco?.Range || (() => {}))(lineNumber, 1, lineNumber, 1),
    options: {
      isWholeLine: true,
      className: 'error-underline',
      borderStyle: 'dotted',
      borderColor: `${colors.accentWarm || colors.accentRose}60`,
      borderWidth: '0 0 2px 0',
    },
  };
}

/**
 * Get scrollable line number for editor
 * @param {number} lineNumber - 1-based line number
 * @returns {number} Same as input (for scrolling to line)
 */
export function getScrollToLine(lineNumber) {
  return Math.max(1, Math.min(lineNumber, 1000000)); // Safety bounds
}

/**
 * Configuration for error styling
 * Used in CSS or inline styles
 */
export const errorHighlightStyles = {
  container: (theme) => ({
    background: `${theme.colors.accentWarm || theme.colors.accentRose}10`,
    borderLeft: `3px solid ${theme.colors.accentWarm || theme.colors.accentRose}`,
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    lineHeight: '1.4',
    color: theme.colors.textPrimary,
  }),

  icon: (theme) => ({
    color: theme.colors.accentWarm || theme.colors.accentRose,
    marginRight: '8px',
    display: 'inline-block',
  }),
};
