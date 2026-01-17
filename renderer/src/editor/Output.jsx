import { useState } from "react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      
      const result = await executeCode(language, sourceCode);
      
      // Handle the response from Piston API
      const output = result.run?.output || result.compile?.output || "";
      const stderr = result.run?.stderr || result.compile?.stderr || "";
      
      setOutput(output.split("\n"));
      setIsError(!!stderr);
      
      if (stderr) {
        setErrorMessage(stderr);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Unable to run code");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "50%", padding: "10px" }}>
      <h2 style={{ marginBottom: "10px", fontSize: "18px" }}>Output</h2>
      <button
        onClick={runCode}
        disabled={isLoading}
        style={{
          padding: "8px 16px",
          marginBottom: "16px",
          backgroundColor: isLoading ? "#ccc" : "#48bb78",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      {errorMessage && (
        <div style={{ padding: "10px", marginBottom: "10px", backgroundColor: "#fee", color: "#c53030", borderRadius: "4px" }}>
          {errorMessage}
        </div>
      )}
      <div
        style={{
          height: "75vh",
          padding: "8px",
          color: isError ? "#fc8181" : "#fff",
          border: isError ? "1px solid #c53030" : "1px solid #333",
          borderRadius: "4px",
          backgroundColor: "#1e1e1e",
          overflowY: "auto",
          fontFamily: "monospace",
        }}
      >
        {output
          ? output.map((line, i) => <div key={i}>{line || "\u00A0"}</div>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;