import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

export default function CodeEditor({ document, onChange }) {
  const editorRef = useRef(null);
  const currentDocumentRef = useRef(document);

  useEffect(() => {
    if (editorRef.current && document && currentDocumentRef.current?.id !== document.id) {
      editorRef.current.setValue(document.text || "");
      currentDocumentRef.current = document;
    }
  }, [document]);

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Set initial value
    if (document && document.text) {
      editor.setValue(document.text);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={document?.language || "javascript"}
      defaultValue={document?.text || "// Start typing here"}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
    />
  );
}