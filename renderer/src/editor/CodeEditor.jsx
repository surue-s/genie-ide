import { useEffect, useRef, useCallback, useMemo } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, basicSetup } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const languageSupport = {
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

export default function CodeEditor({ document, onChange, editorRef, theme }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const langCompartmentRef = useRef(null);
  const themeCompartmentRef = useRef(null);
  const prevLanguageRef = useRef(null);
  const prevThemeRef = useRef(null);

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

  const language = document.language || "javascript";

  // Create theme memoized to avoid recreating it every render
  const editorTheme = useMemo(() => {
    const colors = theme?.colors || {};
    return EditorView.theme(
      {
        ".cm-editor": {
          backgroundColor: colors.bgApp || "#161226",
          color: colors.textPrimary || "#ccc",
          height: "100%",
          fontSize: "14px",
          fontFamily: "'Fira Code', 'Monaco', 'Ubuntu Mono', monospace",
        },
        ".cm-gutters": {
          backgroundColor: colors.bgPanel || "#1a1d27",
          borderRight: `1px solid ${colors.borderSubtle || "#2a2f3d"}`,
          color: colors.textMuted || "#8b93a7",
        },
        ".cm-linenumber": {
          color: colors.textMuted || "#8b93a7",
        },
        ".cm-linenumber.cm-active": {
          color: colors.textSecondary || "#d6c9f0",
          fontWeight: "bold",
        },
        ".cm-cursor": {
          borderLeftColor: colors.accentMint || "#e3a6d8",
        },
        ".cm-selection": {
          backgroundColor: `${colors.accentMint || "#e3a6d8"}40`,
        },
        ".cm-activeLine": {
          backgroundColor: `${colors.borderSubtle || "#2a2f3d"}40`,
        },
        ".cm-matchingBracket": {
          backgroundColor: `${colors.accentCyan || "#b99cff"}30`,
          outline: `1px solid ${colors.accentCyan || "#b99cff"}`,
        },
      },
      { dark: true }
    );
  }, [theme]);

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;

    const languageExt = languageSupport[language]?.() || javascript();
    
    // Create compartments for dynamic updates
    const langCompartment = new Compartment();
    const themeCompartment = new Compartment();
    langCompartmentRef.current = langCompartment;
    themeCompartmentRef.current = themeCompartment;

    const state = EditorState.create({
      doc: document.text || "",
      extensions: [
        basicSetup,
        langCompartment.of(languageExt),
        themeCompartment.of(editorTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
      dispatch: (tr) => {
        view.update([tr]);
        // Ensure container stays visible
        if (containerRef.current) {
          containerRef.current.style.display = "block";
        }
      },
    });

    viewRef.current = view;
    if (editorRef) editorRef.current = view;
    prevLanguageRef.current = language;
    prevThemeRef.current = theme;

    // Force layout recalculation
    setTimeout(() => {
      view.dispatch({ changes: [] }); // Minimal dispatch to trigger render
    }, 0);

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []); // Only initialize once

  // Handle language change
  useEffect(() => {
    if (!viewRef.current || prevLanguageRef.current === language) return;

    prevLanguageRef.current = language;
    try {
      const languageExt = languageSupport[language]?.() || javascript();
      
      if (langCompartmentRef.current) {
        viewRef.current.dispatch({
          effects: langCompartmentRef.current.reconfigure(languageExt),
        });
      }
    } catch (error) {
      console.error(`Failed to switch language to ${language}:`, error);
      // Fallback to javascript if language fails
      if (langCompartmentRef.current) {
        viewRef.current.dispatch({
          effects: langCompartmentRef.current.reconfigure(javascript()),
        });
      }
    }
  }, [language]);

  // Handle document text change
  useEffect(() => {
    if (!viewRef.current) return;

    const currentText = viewRef.current.state.doc.toString();
    if (currentText !== document.text) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentText.length,
          insert: document.text || "",
        },
      });
    }
  }, [document.id]);

  // Handle theme changes
  useEffect(() => {
    if (!viewRef.current || prevThemeRef.current === theme) return;

    prevThemeRef.current = theme;
    try {
      if (themeCompartmentRef.current) {
        viewRef.current.dispatch({
          effects: themeCompartmentRef.current.reconfigure(editorTheme),
        });
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  }, [theme, editorTheme]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "block",
        position: "relative",
        backgroundColor: theme?.colors?.bgApp || "#161226",
      }}
    />
  );
}