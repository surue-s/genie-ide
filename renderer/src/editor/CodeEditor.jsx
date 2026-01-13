import Editor from "@monaco-editor/react";

export default function CodeEditor({ onChange }) {
  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// Start typing here"
      onChange={(value) => onChange?.(value)}
      loading={<div>Loading editor...</div>}
    />
  );
}