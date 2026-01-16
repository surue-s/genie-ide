import { useState } from "react";
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import { createDocument } from "./core/document";
import { LANGUAGE_VERSIONS } from "./core/constants";
import Output from "./editor/Output"; // Make sure this import exists

export default function App() {
  const initialDoc = createDocument("// Welcome to Genie IDE\n");
  initialDoc.title = "welcome.js";
  initialDoc.language = "javascript";

  const [documents, setDocuments] = useState([initialDoc]);
  const [currentDocumentId, setCurrentDocumentId] = useState(initialDoc.id);

  const currentDocument = documents.find(d => d.id === currentDocumentId);

  /* Handlers */

  const handleCodeChange = (code) => {
    if (!currentDocument) return;

    setDocuments(docs =>
      docs.map(doc =>
        doc.id === currentDocumentId
          ? {
              ... doc,
              text: code,
              version: doc.version + 1,
              updatedAt: Date.now()
            }
          : doc
      )
    );
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;

    setDocuments(docs =>
      docs.map(doc =>
        doc.id === currentDocumentId
          ? { ...doc, language }
          : doc
      )
    );
  };

  const handleNewFile = () => {
    const newDoc = createDocument("// New file\n");
    newDoc.title = `untitled-${newDoc.id.slice(0, 4)}.js`;
    newDoc.language = "javascript";

    setDocuments(docs => [...docs, newDoc]);
    setCurrentDocumentId(newDoc.id);
  };

  /* UI */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0E0F13",
        color:  "#ccc"
      }}
    >
      {/* Tabs */}
      <Tabs
        documents={documents}
        currentDocumentId={currentDocumentId}
        onSelect={setCurrentDocumentId}
      />

      {/* Main Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Left Panel */}
        <div
          style={{
            width: 240,
            background: "#111318",
            borderRight: "1px solid #1f2330",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap:  12
          }}
        >
          <div style={{ fontSize:  12, color: "#8b93a7" }}>
            EXPLORER
          </div>

          <button
            onClick={handleNewFile}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 8px",
              cursor: "pointer"
            }}
          >
            + New File
          </button>

          <div>
            <label style={{ fontSize: 12, color: "#8b93a7" }}>
              LANGUAGE
            </label>
            <select
              value={currentDocument?.language}
              onChange={handleLanguageChange}
              style={{
                width: "100%",
                marginTop: 6,
                background: "#1a1d27",
                color: "#ccc",
                border: "1px solid #2a2f3d",
                padding: 6
              }}
            >
              {Object.keys(LANGUAGE_VERSIONS).map(lang => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 12, color: "#8b93a7" }}>
            Version:{" "}
            {currentDocument &&
              LANGUAGE_VERSIONS[currentDocument.language]}
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 2, background: "#0E0F13" }}>
          <CodeEditor
            document={currentDocument}
            onChange={handleCodeChange}
          />
        </div>

        {/* Output */}
        <div
          style={{
            flex: 1,
            background: "#111318",
            borderLeft: "1px solid #1f2330",
            display:  "flex",
            flexDirection:  "column"
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              fontSize:  12,
              color: "#8b93a7",
              borderBottom: "1px solid #1f2330"
            }}
          >
            OUTPUT
          </div>

          <Output document={currentDocument} />
        </div>
      </div>
    </div>
  );
}