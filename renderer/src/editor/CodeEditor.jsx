import Editor, { loader } from "@monaco-editor/react";

export default function CodeEditor({ document, onChange, editorRef }) {

  if (!document) {
    return (
      <div style={{
        height: "100%",
        background: "#1e1e1e",
        color: "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        No document selected
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={document.language || "javascript"}
      value={document.text}
      theme="vs-dark"
      onMount={(editor, monaco) => {
        if (editorRef) {
          editorRef.current = editor;
        }
        
        // Fix keyboard shortcuts
        editor.addCommand(monaco.KeyCode.End, () => {
          editor.trigger('keyboard', 'cursorEnd', {});
        });
        
        editor.addCommand(monaco.KeyCode.Home, () => {
          editor.trigger('keyboard', 'cursorHome', {});
        });
        
        // Add Ctrl+S to save (prepare for future)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          console.log('Save triggered');
          // Will implement save functionality
        });
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
        cursorSmoothCaretAnimation: true,
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
