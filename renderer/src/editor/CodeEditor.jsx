import Editor from "@monaco-editor/react";

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
      onMount={(editor) => {
        if (editorRef) {
          editorRef.current = editor;
        }
      }}
      onChange={(value) => onChange?.(value ?? "")}
      options={{
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
      }}
    />
  );
}
