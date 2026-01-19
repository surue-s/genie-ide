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

export default function CodeEditor({ document, onChange, editorRef }) {
  const monacoRef = useRef(null);
  const prevLangRef = useRef(null);

  if (!document) {
    return (
      <div style={{
        height: "100%",
        background: "#f6f2f4",
        color: "#5f5a63",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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

  return (
    <Editor
      height="100%"
      language={monacoLanguage}
      value={document.text}
      theme="vs-light"
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
      }}
      onMount={(editor, monaco) => {
        try {
          if (editorRef) {
            editorRef.current = editor;
          }
          monacoRef.current = monaco;
          prevLangRef.current = monacoLanguage;
          
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
