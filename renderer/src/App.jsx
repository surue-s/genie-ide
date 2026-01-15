import { useState } from "react";
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import { createDocument } from "./core/document";
import { LANGUAGE_VERSIONS } from "./core/constants";

export default function App() {
  const initialDoc = createDocument("// Welcome to Genie IDE\n");
  initialDoc.title = "welcome.js";
  initialDoc.language = "javascript";

  const [documents, setDocuments] = useState([initialDoc]);
  const [currentDocumentId, setCurrentDocumentId] = useState(initialDoc.id);

  const currentDocument = documents.find(d => d.id === currentDocumentId);

  /* -------- Handlers -------- */

  const handleCodeChange = (code) => {
    if (!currentDocument) return;

    setDocuments(docs =>
      docs.map(doc =>
        doc.id === currentDocumentId
          ? {
              ...doc,
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

  /* -------- UI -------- */

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Tabs
        documents={documents}
        currentDocumentId={currentDocumentId}
        onSelect={setCurrentDocumentId}
      />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Panel */}
        <div style={{ width: 240, padding: 10, borderRight: "1px solid #222" , background: "#1e1e1e"}}>
          <button onClick={handleNewFile}>New File</button>

          <div style={{ marginTop: 20, color: "#ccc" }}>
            <label>Language</label>
            <select
              value={currentDocument?.language}
              onChange={handleLanguageChange}
              style={{ width: "100%", marginTop: 5 }}
            >
              {Object.keys(LANGUAGE_VERSIONS).map(lang => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#b3b3b3" }}>
            Version:{" "}
            {currentDocument &&
              LANGUAGE_VERSIONS[currentDocument.language]}
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1 }}>
          <CodeEditor
            document={currentDocument}
            onChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
}
