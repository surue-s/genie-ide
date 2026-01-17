// Keyboard shortcuts for the IDE
export const SHORTCUTS = {
  NEW_FILE: { key: 'N', ctrl: true, description: 'Create new file' },
  CLOSE_FILE: { key: 'W', ctrl: true, description: 'Close current file' },
  SAVE_FILE: { key: 'S', ctrl: true, description: 'Save file' },
  RENAME_FILE: { key: 'R', ctrl: true, description: 'Rename file' },
  RUN_CODE: { key: 'Enter', ctrl: true, description: 'Run code' },
  TOGGLE_HEX: { key: 'H', ctrl: true, description: 'Toggle hex view' },
  NEXT_TAB: { key: 'Tab', ctrl: true, description: 'Next tab' },
  PREV_TAB: { key: 'Tab', ctrl: true, shift: true, description: 'Previous tab' },
};

// Hook to handle keyboard shortcuts
export function useKeyboardShortcuts(handlers) {
  const handleKeyDown = (e) => {
    const { ctrlKey, metaKey, shiftKey, key } = e;
    const isMod = ctrlKey || metaKey;

    // New file (Ctrl+N)
    if (isMod && key === 'n' && handlers.onNewFile) {
      e.preventDefault();
      handlers.onNewFile();
    }

    // Close file (Ctrl+W)
    if (isMod && key === 'w' && handlers.onCloseFile) {
      e.preventDefault();
      handlers.onCloseFile();
    }

    // Rename file (Ctrl+R)
    if (isMod && key === 'r' && handlers.onRenameFile) {
      e.preventDefault();
      handlers.onRenameFile();
    }

    // Run code (Ctrl+Enter)
    if (isMod && key === 'Enter' && handlers.onRunCode) {
      e.preventDefault();
      handlers.onRunCode();
    }

    // Toggle hex view (Ctrl+H)
    if (isMod && key === 'h' && handlers.onToggleHex) {
      e.preventDefault();
      handlers.onToggleHex();
    }

    // Next tab (Ctrl+Tab)
    if (isMod && key === 'Tab' && !shiftKey && handlers.onNextTab) {
      e.preventDefault();
      handlers.onNextTab();
    }

    // Previous tab (Ctrl+Shift+Tab)
    if (isMod && shiftKey && key === 'Tab' && handlers.onPrevTab) {
      e.preventDefault();
      handlers.onPrevTab();
    }
  };

  return handleKeyDown;
}
