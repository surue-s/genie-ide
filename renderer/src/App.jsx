import { useState, useRef, useEffect } from "react";
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import HexFileNavigator from "./editor/HexFileNavigator";
import FileRenameModal from "./editor/FileRenameModal";
import ShortcutsHelp from "./editor/ShortcutsHelp";
import { createDocument, changeLanguage } from "./core/document";
import { LANGUAGE_VERSIONS } from "./core/constants";
import { getExtensionForLanguage } from "./core/fileExtensions";
import { useKeyboardShortcuts } from "./core/shortcuts";
import Output from "./editor/Output";

export default function App() {
  const initialDoc = createDocument("// Welcome to Genie IDE\n", "welcome.js", "javascript");

  const [documents, setDocuments] = useState([initialDoc]);
  const [currentDocumentId, setCurrentDocumentId] = useState(initialDoc.id);
  const [showHexNav, setShowHexNav] = useState(false);
  const [renamingDoc, setRenamingDoc] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const editorRef = useRef(null);
  const outputRef = useRef(null);

  const currentDocument = documents.find(d => d.id === currentDocumentId);

  /* Handlers */

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
          ? changeLanguage(doc, language)
          : doc
      )
    );
  };

  const handleNewFile = () => {
    const newDoc = createDocument("// New file\n", "", "javascript");
    setDocuments(docs => [...docs, newDoc]);
    setCurrentDocumentId(newDoc.id);
  };

  const handleCloseFile = (docId) => {
    if (documents.length === 1) return; // Keep at least one file

    setDocuments(docs => {
      const filtered = docs.filter(d => d.id !== docId);
      
      // If closing current document, switch to another
      if (docId === currentDocumentId && filtered.length > 0) {
        setCurrentDocumentId(filtered[0].id);
      }
      
      return filtered;
    });
  };

  const handleRenameFile = (docId, newTitle) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, title: newTitle }
          : doc
      )
    );
  };

  const handleNextTab = () => {
    const currentIndex = documents.findIndex(d => d.id === currentDocumentId);
    const nextIndex = (currentIndex + 1) % documents.length;
    setCurrentDocumentId(documents[nextIndex].id);
  };

  const handlePrevTab = () => {
    const currentIndex = documents.findIndex(d => d.id === currentDocumentId);
    const prevIndex = currentIndex === 0 ? documents.length - 1 : currentIndex - 1;
    setCurrentDocumentId(documents[prevIndex].id);
  };

  // Keyboard shortcuts
  const handleKeyDown = useKeyboardShortcuts({
    onNewFile: handleNewFile,
    onCloseFile: () => currentDocument && handleCloseFile(currentDocument.id),
    onRenameFile: () => currentDocument && setRenamingDoc(currentDocument),
    onToggleHex: () => setShowHexNav(prev => !prev),
    onNextTab: handleNextTab,
    onPrevTab: handlePrevTab,
    onRunCode: () => outputRef.current?.runCode(),
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(true);
      } else {
        handleKeyDown(e);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKeyDown]);

  /* UI */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0E0F13",
        color: "#ccc"
      }}
    >
      {/* Tabs */}
      <Tabs
        documents={documents}
        currentDocumentId={currentDocumentId}
        onSelect={setCurrentDocumentId}
        onClose={handleCloseFile}
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
            gap: 12
          }}
        >
          <div style={{ fontSize: 12, color: "#8b93a7" }}>
            EXPLORER
          </div>

          <button
            onClick={handleNewFile}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            + New File
          </button>

          <button
            onClick={() => setRenamingDoc(currentDocument)}
            disabled={!currentDocument}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 8px",
              cursor: currentDocument ? "pointer" : "not-allowed",
              borderRadius: "4px",
              opacity: currentDocument ? 1 : 0.5,
            }}
          >
            Rename File
          </button>

          <button
            onClick={() => setShowHexNav(!showHexNav)}
            style={{
              background: showHexNav ? "#48bb78" : "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#fff",
              padding: "6px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {showHexNav ? "📝 Editor" : "🔷 Hex View"}
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            title="Show keyboard shortcuts"
          >
            ❓ Help
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
                padding: 6,
                borderRadius: "4px",
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

          <div style={{ fontSize: 11, color: "#666", marginTop: "auto", paddingTop: 12, borderTop: "1px solid #1f2330" }}>
            <div style={{ marginBottom: 4 }}>Files: {documents.length}</div>
            <div>Press <kbd style={{ backgroundColor: "#2a2d35", padding: "2px 4px", borderRadius: 2 }}>?</kbd> for shortcuts</div>
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 2, background: "#0E0F13", position: "relative" }}>
          {showHexNav ? (
            <HexFileNavigator
              documents={documents}
              currentDocumentId={currentDocumentId}
              onSelect={setCurrentDocumentId}
              onClose={handleCloseFile}
              onRename={(id) => {
                const doc = documents.find(d => d.id === id);
                if (doc) setRenamingDoc(doc);
              }}
            />
          ) : (
            <CodeEditor
              document={currentDocument}
              onChange={handleCodeChange}
              editorRef={editorRef}
            />
          )}
        </div>

        {/* Output */}
        <div
          style={{
            flex: 1,
            background: "#111318",
            borderLeft: "1px solid #1f2330",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              fontSize: 12,
              color: "#8b93a7",
              borderBottom: "1px solid #1f2330"
            }}
          >
            OUTPUT
          </div>

          <Output ref={outputRef} editorRef={editorRef} language={currentDocument?.language} />
        </div>
      </div>

      {/* Rename Modal */}
      {renamingDoc && (
        <FileRenameModal
          document={renamingDoc}
          onRename={handleRenameFile}
          onClose={() => setRenamingDoc(null)}
        />
      )}

      {/* Shortcuts Help */}
      {showShortcuts && (
        <ShortcutsHelp onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
