import Editor from "@monaco-editor/react";
import { useRef } from "react";

export default function CodeEditor({ document, onChange }) {
  const editorRef = useRef(null);

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
        editorRef.current = editor;
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
