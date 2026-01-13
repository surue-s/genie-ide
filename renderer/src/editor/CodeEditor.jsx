import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";

loader.config({ 
  paths: { 
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' 
  } 
});

export default function CodeEditor({ onChange }) {
  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// Start typing here"
      onChange={(value) => onChange?.(value)}
    />
  );
}