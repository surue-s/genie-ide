import Editor from "@monaco-editor/react";

self.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case "json":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker",
            import.meta.url
          )
        );
      case "css":
      case "scss":
      case "less":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/css/css.worker",
            import.meta.url
          )
        );
      case "html":
      case "handlebars":
      case "razor":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/html/html.worker",
            import.meta.url
          )
        );
      case "typescript":
      case "javascript":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/typescript/ts.worker",
            import.meta.url
          )
        );
      default:
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/editor/editor.worker",
            import.meta.url
          )
        );
    }
  },
};

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
