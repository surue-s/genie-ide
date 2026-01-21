import { useEffect, useRef, useMemo } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

// Create compartments for dynamic reconfiguration
const languageCompartment = new Compartment();
const themeCompartment = new Compartment();

// Language extension mapping - functions that return extensions
const getLanguageExtension = (lang) => {
  const extensions = {
    javascript: () => javascript(),
    typescript: () => javascript({ typescript: true }),
    python: () => python(),
    java: () => java(),
    c: () => cpp(),
    "c++": () => cpp(),
    rust: () => rust(),
    go: () => go(),
    php: () => php(),
    html: () => html(),
    css: () => css(),
  };
  return (extensions[lang] || extensions.javascript)();
};

// Create a custom light theme
const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#FFFFFF",
    color: "#2B1F3A"
  },
  ".cm-content": {
    caretColor: "#4FBFB3"
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "#4FBFB3"
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "rgba(79, 191, 179, 0.15)"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(43, 31, 58, 0.03)"
  },
  ".cm-gutters": {
    backgroundColor: "#F5F2F7",
    color: "#8C7FA3",
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(43, 31, 58, 0.06)"
  }
}, { dark: false });

// Basic setup extensions (similar to @codemirror/basic-setup but explicit)
const basicSetupExtensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    indentWithTab
  ])
];

export default function CodeEditor({ document, onChange, editorRef, theme }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Memoize computed values
  const language = document?.language || "javascript";
  const isDarkTheme = theme?.type !== "light";

  // Get editor colors from theme
  const editorColors = useMemo(() => {
    if (!theme) return null;
    return theme.editor || {
      background: isDarkTheme ? "#161226" : "#FFFFFF",
      foreground: isDarkTheme ? "#F1EAF7" : "#2B1F3A",
    };
  }, [theme, isDarkTheme]);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current || !document) return;

    // Clean up existing view
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const initialLanguage = getLanguageExtension(document.language || "javascript");
    const initialTheme = isDarkTheme ? oneDark : lightTheme;

    const startState = EditorState.create({
      doc: document.text || "",
      extensions: [
        ...basicSetupExtensions,
        languageCompartment.of(initialLanguage),
        themeCompartment.of(initialTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChangeRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px"
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace"
          },
          ".cm-content": {
            padding: "8px 0"
          },
          ".cm-gutters": {
            borderRight: "none"
          }
        })
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    viewRef.current = view;
    
    if (editorRef) {
      editorRef.current = view;
    }

    // Cleanup function
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      if (editorRef) {
        editorRef.current = null;
      }
    };
  }, [document?.id]); // Re-create editor when document changes

  // Update document content when it changes externally
  useEffect(() => {
    if (!viewRef.current || !document) return;

    const currentValue = viewRef.current.state.doc.toString();
    if (currentValue !== document.text) {
      viewRef.current.dispatch({
        changes: { from: 0, to: currentValue.length, insert: document.text || "" }
      });
    }
  }, [document?.text]);

  // Update language when it changes
  useEffect(() => {
    if (!viewRef.current) return;

    const newLanguage = getLanguageExtension(language);
    
    viewRef.current.dispatch({
      effects: languageCompartment.reconfigure(newLanguage)
    });
  }, [language]);

  // Update theme when it changes
  useEffect(() => {
    if (!viewRef.current) return;
    
    const newTheme = isDarkTheme ? oneDark : lightTheme;
    
    viewRef.current.dispatch({
      effects: themeCompartment.reconfigure(newTheme)
    });
  }, [isDarkTheme]);

  if (!document) {
    return (
      <div
        style={{
          height: "100%",
          background: theme?.colors?.bgApp || "#161226",
          color: theme?.colors?.textSecondary || "#9C8FB4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
        }}
      >
        No document selected
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: editorColors?.background || (isDarkTheme ? "#161226" : "#FFFFFF"),
      }} 
    />
  );
}