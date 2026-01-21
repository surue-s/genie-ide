/**
 * Error Highlighting System for CodeMirror
 * Provides soft, non-intrusive visual indicators in the editor
 * Uses decorations to highlight problematic lines
 */

import { StateField, StateEffect, RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';

// Define error highlighting decorations
const errorLineHighlightDeco = Decoration.line({
  attributes: { class: "cm-error-line-highlight" }
});

const errorGutterDeco = Decoration.gutter({
  element: "gutter",
  attributes: { 
    class: "cm-error-gutter",
    style: "background: #ff6b6b40; border-left: 2px solid #ff6b6b;"
  }
});

const errorInlineMessageDeco = Decoration.widget({
  widget: {
    dom: (() => {
      const wrap = document.createElement("div");
      wrap.className = "cm-error-inline-message";
      wrap.style.padding = "2px 0 2px 20px";
      wrap.style.color = "#ff6b6b";
      wrap.style.fontSize = "12px";
      wrap.style.background = "#ff6b6b10";
      return wrap;
    })()
  }
});

// State field to track error decorations
const errorHighlightField = StateField.define({
  create() {
    return [];
  },
  update(value, tr) {
    // Update error decorations on document changes
    if (tr.docChanged) {
      // Keep errors that are still relevant after document changes
      return value;
    }
    return value;
  },
  provide: f => EditorView.decorations.from(f, errors => {
    const builder = new RangeSetBuilder();
    for (let error of errors) {
      // Add line highlight decoration
      builder.add(error.from, error.to, errorLineHighlightDeco);
      
      // Add gutter marker
      builder.add(error.from, error.from, errorGutterDeco);
      
      // Add inline message if present
      if (error.message) {
        builder.add(error.from, error.to, errorInlineMessageDeco);
      }
    }
    return builder.finish();
  })
});

/**
 * Create a CodeMirror decoration for error highlighting
 * @param {number} lineNumber - Line number to highlight (0-based)
 * @param {Object} theme - Theme object
 * @returns {Object} CodeMirror decoration configuration
 */
export function createErrorDecoration(lineNumber, theme) {
  const colors = theme.colors;

  // Return position information for the error line
  return {
    from: lineNumber,  // Character position where error occurs
    to: lineNumber,    // End position
    options: {
      attributes: {
        style: `
          background-color: ${colors.warningBgLight || `${colors.accentWarm || colors.accentRose}15`};
          border-left: 3px solid ${colors.accentWarm || colors.accentRose};
        `,
      }
    }
  };
}

/**
 * Create inline message decoration for CodeMirror
 * @param {number} position - Position in the document
 * @param {string} message - Error message
 * @param {Object} theme - Theme object
 * @returns {Object} CodeMirror decoration
 */
export function createInlineMessage(position, message, theme) {
  const colors = theme.colors;

  return {
    from: position,
    to: position,
    options: {
      attributes: {
        style: `
          display: block;
          padding: 2px 0 2px 20px;
          color: ${colors.accentWarm || colors.accentRose};
          font-size: 12px;
          background: ${`${colors.accentWarm || colors.accentRose}10`};
        `,
        class: 'cm-error-inline-message'
      }
    }
  };
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

/**
 * Get a position for a given line number
 * @param {number} lineNumber - 0-based line number
 * @param {EditorState} state - CodeMirror state instance
 * @returns {number} Position in the document
 */
export function getPositionFromLine(state, lineNumber) {
  try {
    const line = state.doc.line(Math.min(lineNumber + 1, state.doc.lines));
    return line.from;
  } catch (e) {
    // If line doesn't exist, return 0
    return 0;
  }
}

/**
 * Apply error highlighting to a specific line in CodeMirror
 * @param {EditorView} view - CodeMirror view instance
 * @param {number} lineNumber - Line number to highlight (0-indexed)
 * @param {string} message - Error message to display
 * @param {Object} theme - Current theme
 */
export function highlightErrorLine(view, lineNumber, message, theme) {
  if (!view) return;
  
  const pos = getPositionFromLine(view.state, lineNumber);
  
  // Add temporary highlighting - this would be done by adding a state effect
  // and managing the decorations in the state field
  console.log(`Error on line ${lineNumber + 1}: ${message}`);
}

/**
 * Clear all error highlights from the editor
 * @param {EditorView} view - CodeMirror view instance
 */
export function clearErrorHighlights(view) {
  if (!view) return;
  
  // Clearing would involve dispatching a transaction that removes error decorations
  console.log("Clearing error highlights");
}