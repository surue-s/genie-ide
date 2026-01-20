import { useState, forwardRef, useImperativeHandle } from "react";
import ErrorInterpreter from "./ErrorInterpreter";
import { parseError } from "../core/errorExplanations";
import { executeCode } from "../api";

const Output = forwardRef(({ editorRef, language, theme }, ref) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedError, setParsedError] = useState(null);
  
  const colors = theme.colors;

  const runCode = async () => {
    if (!editorRef || !editorRef.current) {
      setErrorMessage("Editor not ready");
      setIsError(true);
      return;
    }
    
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    
    try {
      setIsLoading(true);
      setErrorMessage("");
      setIsError(false);
      setOutput(null);
      setParsedError(null);
      
      const result = await executeCode(language, sourceCode);
      
      // Handle the response from Piston API
      const output = result.run?.output || result.compile?.output || "";
      const stderr = result.run?.stderr || result.compile?.stderr || "";
      
      setOutput(output.split("\n"));
      setIsError(!!stderr);
      
      if (stderr) {
        setErrorMessage(stderr);
        // Parse error for beginner-friendly explanation
        const parsed = parseError(stderr);
        setParsedError(parsed);
      } else {
        setParsedError(null);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Unable to run code");
      setIsError(true);
      // Try to parse the error
      const errMsg = error.response?.data?.message || error.message || "";
      const parsed = parseError(errMsg);
      setParsedError(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose runCode method to parent component
  useImperativeHandle(ref, () => ({
    runCode
  }));

  return (
    <div style={{ 
      width: "100%", 
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "16px",
      backgroundColor: colors.bgPanel,
      overflow: "hidden",
    }}>
      <button
        onClick={runCode}
        disabled={isLoading}
        style={{
          padding: "8px 16px",
          marginBottom: "16px",
          backgroundColor: isLoading ? colors.buttonBgActive : colors.success,
          color: colors.buttonText,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: "10px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: 13,
          fontWeight: 500,
          transition: "all 140ms ease-out",
          opacity: isLoading ? 0.6 : 1,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => !isLoading && (e.target.style.filter = 'brightness(1.1)')}
        onMouseLeave={(e) => !isLoading && (e.target.style.filter = 'brightness(1)')}
        onFocus={(e) => e.target.style.boxShadow = colors.focusRing}
        onBlur={(e) => e.target.style.boxShadow = 'none'}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>

      {/* Error Section - Constrained with flex */}
      {isError && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 12,
          maxHeight: '45%',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Error Interpreter (shown when error exists) */}
          {parsedError && (
            <ErrorInterpreter 
              error={parsedError}
              theme={theme}
              onLocationClick={parsedError.line && editorRef?.current ? () => {
                // Scroll editor to error line
                editorRef.current.revealLineInCenter(parsedError.line);
                editorRef.current.focus();
              } : null}
            />
          )}

          {/* Raw error message (for reference) */}
          {errorMessage && (
            <div style={{ 
              padding: "10px 12px", 
              backgroundColor: `${colors.error}20`,
              color: colors.error, 
              borderRadius: "10px",
              border: `1px solid ${colors.error}`,
              fontSize: 12,
              fontFamily: "monospace",
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Output Container - Takes remaining space */}
      {/* Output Container - Takes remaining space */}
      <div
        style={{
          flex: 1,
          padding: "12px",
          color: isError ? colors.error : colors.textPrimary,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: "10px",
          backgroundColor: colors.bgPanelAlt,
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: 12,
          lineHeight: 1.5,
          minHeight: 0,
        }}
      >
        {output
          ? output.map((line, i) => <div key={i}>{line || "\u00A0"}</div>)
          : <div style={{ color: colors.textMuted }}>Click "Run Code" to see the output here</div>}
      </div>
    </div>
  );
});

export default Output;