import { useEffect, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { LANGUAGE_TO_MONACO } from "../core/constants";

// Preload Monaco language definitions
loader.init().then(monaco => {
  // Languages are pre-loaded in Monaco, but we ensure they're registered
  const langIds = ['python', 'java', 'c', 'cpp', 'go', 'rust', 'php'];
  langIds.forEach(lang => {
    try {
      if (!monaco.languages.getLanguages().find(l => l.id === lang)) {
        monaco.languages.register({ id: lang });
      }
    } catch (e) {
      // Language already registered
    }
  });
});

export default function CodeEditor({ document, onChange, editorRef, theme }) {
  const monacoRef = useRef(null);
  const prevLangRef = useRef(null);
  const prevThemeRef = useRef(null);

  if (!document) {
    return (
      <div style={{
        height: "100%",
        background: theme.colors.bgApp,
        color: theme.colors.textSecondary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
      }}>
        No document selected
      </div>
    );
  }

  // Map internal language name to Monaco language ID
  const monacoLanguage = LANGUAGE_TO_MONACO[document.language] || "javascript";

  // Handle language change with proper error handling
  useEffect(() => {
    if (!editorRef?.current || !monacoRef.current) return;
    
    // Only update if language actually changed
    if (prevLangRef.current === monacoLanguage) return;
    prevLangRef.current = monacoLanguage;

    try {
      const editor = editorRef.current;
      if (!editor) return;
      
      const model = editor.getModel();
      if (!model) return;
      
      // Use setModelLanguage which is safer
      monacoRef.current.editor.setModelLanguage(model, monacoLanguage);
    } catch (error) {
      console.warn('Language change failed:', error?.message);
    }
  }, [monacoLanguage, document.id]);

  // Handle theme change
  useEffect(() => {
    if (!editorRef?.current || !monacoRef.current) return;
    
    // Only update if theme actually changed
    const themeKey = `${theme.type}-${theme.name}`;
    if (prevThemeRef.current === themeKey) return;
    prevThemeRef.current = themeKey;

    try {
      // Determine which Monaco theme to use based on the selected theme
      let monacoTheme = 'genie-dark';
      if (theme.name === 'Soft Light') {
        monacoTheme = 'genie-light';
      } else if (theme.name === 'Soft Purple-Pink') {
        monacoTheme = 'genie-soft-purple-pink';
      } else if (theme.type === 'light') {
        monacoTheme = 'genie-light';
      }
      
      monacoRef.current.editor.setTheme(monacoTheme);
    } catch (error) {
      console.warn('Theme change failed:', error?.message);
    }
  }, [theme]);

  return (
    <Editor
      height="100%"
      language={monacoLanguage}
      value={document.text}
      theme={
        theme.name === 'Soft Light' 
          ? 'genie-light' 
          : theme.name === 'Soft Purple-Pink'
            ? 'genie-soft-purple-pink'
            : theme.type === 'light' 
              ? 'genie-light' 
              : 'genie-dark'
      }
      beforeMount={(monaco) => {
        // Ensure all language definitions are available before mount
        const langIds = ['python', 'java', 'c', 'cpp', 'go', 'rust', 'php'];
        langIds.forEach(lang => {
          try {
            const found = monaco.languages.getLanguages().find(l => l.id === lang);
            if (!found) {
              monaco.languages.register({ id: lang });
            }
          } catch (e) {
            // Silently handle - language may already exist
          }
        });

        // Define Genie Dark Theme (Calm Retro Mauve)
        monaco.editor.defineTheme('genie-dark', {
          base: 'vs-dark',
          inherit: false,
          rules: [
            { token: '', foreground: 'F1EAF7' },
            { token: 'comment', foreground: '9C8FB4', fontStyle: 'italic' },
            { token: 'keyword', foreground: '74B7FF', fontStyle: 'bold' },
            { token: 'string', foreground: '7BE3B1' },
            { token: 'number', foreground: 'F6C177' },
            { token: 'function', foreground: 'FF6FAE' },
            { token: 'variable', foreground: 'F1EAF7' },
            { token: 'type', foreground: 'F2B6A0' },
            { token: 'class', foreground: 'F2B6A0', fontStyle: 'bold' },
            { token: 'operator', foreground: 'C9BEDA' },
            { token: 'identifier', foreground: 'F1EAF7' },
            { token: 'constant', foreground: 'F6C177' },
            { token: 'parameter', foreground: 'F1EAF7' },
            { token: 'tag', foreground: '74B7FF' },
            { token: 'attribute', foreground: 'F2B6A0' },
            { token: 'punctuation', foreground: 'C9BEDA' },
          ],
          colors: {
            'editor.background': '#161226',
            'editor.foreground': '#F1EAF7',
            'editor.lineHighlightBackground': '#1F1830',
            'editorLineNumber.foreground': '#9C8FB4',
            'editorLineNumber.activeForeground': '#C9BEDA',
            'editor.selectionBackground': '#63D2C64D',
            'editor.inactiveSelectionBackground': '#63D2C626',
            'editorCursor.foreground': '#63D2C6',
            'editor.findMatchBackground': '#63D2C64D',
            'editor.findMatchHighlightBackground': '#63D2C626',
            'editorIndentGuide.background': '#3A2D57',
            'editorIndentGuide.activeBackground': '#63D2C6',
            'editorWhitespace.foreground': '#3A2D57',
            'editorWidget.background': '#1F1830',
            'editorWidget.border': '#3A2D57',
            'editorSuggestWidget.background': '#1F1830',
            'editorSuggestWidget.foreground': '#F1EAF7',
            'editorSuggestWidget.selectedBackground': '#2B2142',
            'editorSuggestWidget.selectedBackground': '#2B2142',
            'list.hoverBackground': '#2B2142',
            'list.activeSelectionBackground': '#2B2142',
            'list.inactiveSelectionBackground': '#241C38',
          }
        });

        // Define Genie Soft Purple-Pink Theme
        monaco.editor.defineTheme('genie-soft-purple-pink', {
          base: 'vs',
          inherit: false,
          rules: [
            { token: '', foreground: '5D4A7E' },
            { token: 'comment', foreground: '9C8FB4', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'B99CFF', fontStyle: 'bold' },
            { token: 'string', foreground: 'E3A6D8' },
            { token: 'number', foreground: '9C7FD2' },
            { token: 'function', foreground: '7A63A0' },
            { token: 'variable', foreground: '5D4A7E' },
            { token: 'type', foreground: 'B99CFF' },
            { token: 'class', foreground: 'B99CFF', fontStyle: 'bold' },
            { token: 'operator', foreground: '7A63A0' },
            { token: 'identifier', foreground: '5D4A7E' },
            { token: 'constant', foreground: '9C7FD2' },
            { token: 'parameter', foreground: '5D4A7E' },
            { token: 'tag', foreground: 'B99CFF' },
            { token: 'attribute', foreground: 'B99CFF' },
            { token: 'punctuation', foreground: '7A63A0' },
          ],
          colors: {
            'editor.background': '#F8F6FD',
            'editor.foreground': '#5D4A7E',
            'editor.lineHighlightBackground': '#F0ECF7',
            'editorLineNumber.foreground': '#9C8FB4',
            'editorLineNumber.activeForeground': '#7A63A0',
            'editor.selectionBackground': '#E3A6D840',
            'editor.inactiveSelectionBackground': '#E3A6D825',
            'editorCursor.foreground': '#B99CFF',
            'editor.findMatchBackground': '#E3A6D840',
            'editor.findMatchHighlightBackground': '#E3A6D825',
            'editorIndentGuide.background': '#D6C9E9',
            'editorIndentGuide.activeBackground': '#B99CFF',
            'editorWhitespace.foreground': '#D6C9E9',
            'editorWidget.background': '#F9F7FD',
            'editorWidget.border': '#D6C9E9',
            'editorSuggestWidget.background': '#F9F7FD',
            'editorSuggestWidget.foreground': '#5D4A7E',
            'editorSuggestWidget.selectedBackground': '#E8E2F2',
            'editorSuggestWidget.selectedBackground': '#E8E2F2',
            'list.hoverBackground': '#E8E2F2',
            'list.activeSelectionBackground': '#E8E2F2',
            'list.inactiveSelectionBackground': '#F0ECF7',
          }
        });

        // Define Genie Light Theme (Soft Light)
        monaco.editor.defineTheme('genie-light', {
          base: 'vs',
          inherit: false,
          rules: [
            { token: '', foreground: '2B1F3A' },
            { token: 'comment', foreground: '8C7FA3', fontStyle: 'italic' },
            { token: 'keyword', foreground: '5A9FE8', fontStyle: 'bold' },
            { token: 'string', foreground: '5FC994' },
            { token: 'number', foreground: 'D9A555' },
            { token: 'function', foreground: 'E8558D' },
            { token: 'variable', foreground: '2B1F3A' },
            { token: 'type', foreground: 'D9957B' },
            { token: 'class', foreground: 'D9957B', fontStyle: 'bold' },
            { token: 'operator', foreground: '5A4F6B' },
            { token: 'identifier', foreground: '2B1F3A' },
            { token: 'constant', foreground: 'D9A555' },
            { token: 'parameter', foreground: '2B1F3A' },
            { token: 'tag', foreground: '5A9FE8' },
            { token: 'attribute', foreground: 'D9957B' },
            { token: 'punctuation', foreground: '5A4F6B' },
          ],
          colors: {
            'editor.background': '#FFFFFF',
            'editor.foreground': '#2B1F3A',
            'editor.lineHighlightBackground': '#F5F2F7',
            'editorLineNumber.foreground': '#8C7FA3',
            'editorLineNumber.activeForeground': '#5A4F6B',
            'editor.selectionBackground': '#4FBFB34D',
            'editor.inactiveSelectionBackground': '#4FBFB326',
            'editorCursor.foreground': '#4FBFB3',
            'editor.findMatchBackground': '#4FBFB34D',
            'editor.findMatchHighlightBackground': '#4FBFB326',
            'editorIndentGuide.background': '#E0DBE5',
            'editorIndentGuide.activeBackground': '#4FBFB3',
            'editorWhitespace.foreground': '#E0DBE5',
            'editorWidget.background': '#FAF8FB',
            'editorWidget.border': '#E0DBE5',
            'editorSuggestWidget.background': '#FFFFFF',
            'editorSuggestWidget.foreground': '#2B1F3A',
            'editorSuggestWidget.selectedBackground': '#EFEDF1',
            'list.hoverBackground': '#F5F2F7',
            'list.activeSelectionBackground': '#EFEDF1',
            'list.inactiveSelectionBackground': '#F5F2F7',
          }
        });
      }}
      onMount={(editor, monaco) => {
        try {
          if (editorRef) {
            editorRef.current = editor;
          }
          monacoRef.current = monaco;
          prevLangRef.current = monacoLanguage;
          prevThemeRef.current = `${theme.type}-${theme.name}`;
          
          // Fix keyboard shortcuts
          editor.addCommand(monaco.KeyCode.End, () => {
            editor.trigger('keyboard', 'cursorEnd', {});
          });
          
          editor.addCommand(monaco.KeyCode.Home, () => {
            editor.trigger('keyboard', 'cursorHome', {});
          });
          
          // Add Ctrl+S to save
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            console.log('Save triggered');
          });
        } catch (error) {
          console.error('Error in onMount:', error?.message);
        }
      }}
      onChange={(value) => onChange?.(value ?? "")}
      options={{
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        formatOnPaste: true,
        formatOnType: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        folding: true,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        selectOnLineNumbers: true,
      }}
    />
  );
}