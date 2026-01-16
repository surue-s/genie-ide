import React from "react";

const Output = ({ document }) => {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
      <button
        style={{
          background: "#1a1d27",
          border: "1px solid #2a2f3d",
          color: "#ccc",
          padding: "6px 12px",
          cursor: "pointer",
          marginBottom: 12,
          fontSize: 13
        }}
      >
        Run Code
      </button>

      <div
        style={{
          border: "1px solid #2a2f3d",
          minHeight: "calc(100% - 60px)",
          padding: 12,
          borderRadius: 4,
          color: "#8b93a7",
          fontFamily: "monospace",
          fontSize: 13,
          background: "#0E0F13"
        }}
      >
        Click "Run Code" to see output
      </div>
    </div>
  );
};

export default Output;