import { useState, useRef, useEffect } from "react";
import CodeEditor from "./editor/CodeEditor";
import FolderManager from "./editor/FolderManager";
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
  const [showHexNav, setShowHexNav] = useState(true);
  const [renamingDoc, setRenamingDoc] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [hexNavHeight, setHexNavHeight] = useState(300); // pixels
  const [outputHeight, setOutputHeight] = useState(250); // pixels
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);

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
    if (documents.length === 1) return;

    setDocuments(docs => {
      const filtered = docs.filter(d => d.id !== docId);
      
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

  const handleRunCode = () => {
    setShowOutput(true);
    outputRef.current?.runCode();
  };

  // Keyboard shortcuts
  const handleKeyDown = useKeyboardShortcuts({
    onNewFile: handleNewFile,
    onCloseFile: () => currentDocument && handleCloseFile(currentDocument.id),
    onRenameFile: () => currentDocument && setRenamingDoc(currentDocument),
    onToggleHex: () => setShowHexNav(prev => !prev),
    onNextTab: handleNextTab,
    onPrevTab: handlePrevTab,
    onRunCode: handleRunCode,
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

  // Output floating window drag handler
  const handlePanelMouseDown = (e) => {
    if (e.target.closest('[data-divider]')) {
      setIsResizingPanel(true);
    }
  };

  useEffect(() => {
    if (isResizingPanel) {
      const handleMouseMove = (e) => {
        // Calculate new hex nav height based on mouse movement
        const minHexHeight = 100;
        const minOutputHeight = 100;
        const headerHeight = 60;
        const dividerHeight = 4;
        const maxHexHeight = window.innerHeight - headerHeight - minOutputHeight - dividerHeight;
        
        const newHexHeight = Math.max(minHexHeight, Math.min(maxHexHeight, e.clientY - headerHeight));
        setHexNavHeight(newHexHeight);
      };

      const handleMouseUp = () => {
        setIsResizingPanel(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingPanel]);

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
      {/* Header with controls */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #1f2330",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleNewFile}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: 12,
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
              padding: "6px 12px",
              cursor: currentDocument ? "pointer" : "not-allowed",
              borderRadius: "4px",
              opacity: currentDocument ? 1 : 0.5,
              fontSize: 12,
            }}
          >
            ✏️ Rename
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {currentDocument && (
            <div style={{ fontSize: 11, color: "#888" }}>
              {currentDocument.title}
            </div>
          )}
          
          <select
            value={currentDocument?.language}
            onChange={handleLanguageChange}
            style={{
              background: "#1a1d27",
              color: "#ccc",
              border: "1px solid #2a2f3d",
              padding: "6px 8px",
              borderRadius: "4px",
              fontSize: 12,
            }}
          >
            {Object.keys(LANGUAGE_VERSIONS).map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowHexNav(!showHexNav)}
            style={{
              background: showHexNav ? "#48bb78" : "#1a1d27",
              border: "1px solid #2a2f3d",
              color: showHexNav ? "#000" : "#fff",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: showHexNav ? "bold" : "normal",
              fontSize: 12,
            }}
          >
            {showHexNav ? "📊 Graph" : "📝 Hide"}
          </button>

          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              background: showOutput ? "#4299e1" : "#1a1d27",
              border: "1px solid #2a2f3d",
              color: showOutput ? "#fff" : "#ccc",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: showOutput ? "bold" : "normal",
              fontSize: 12,
            }}
          >
            {showOutput ? "▼ Output" : "▲ Output"}
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            style={{
              background: "#1a1d27",
              border: "1px solid #2a2f3d",
              color: "#ccc",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: 12,
            }}
            title="Show keyboard shortcuts"
          >
            ❓
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* Left Panel - Folder Manager */}
        <div
          style={{
            width: 220,
            background: "#111318",
            borderRight: "1px solid #1f2330",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FolderManager
            documents={documents}
            currentDocumentId={currentDocumentId}
            onSelect={setCurrentDocumentId}
            onClose={handleCloseFile}
            onRename={(id) => {
              const doc = documents.find(d => d.id === id);
              if (doc) setRenamingDoc(doc);
            }}
          />
        </div>

        {/* Center Panel - Code Editor (full height) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: "#0E0F13",
          }}
        >
          <CodeEditor
            document={currentDocument}
            onChange={handleCodeChange}
            editorRef={editorRef}
          />
        </div>

        {/* Right Panel - Hex Navigator and Output */}
        {showHexNav && (
          <div
            style={{
              width: rightPanelWidth,
              background: "#111318",
              borderLeft: "1px solid #1f2330",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseDown={handlePanelMouseDown}
          >
            {/* Hex Navigator */}
            <div
              style={{
                padding: "8px 10px",
                fontSize: 11,
                color: "#8b93a7",
                borderBottom: "1px solid #1f2330",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
              }}
            >
              <span>FILES MAP</span>
              <button
                onClick={() => setShowHexNav(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8b93a7",
                  cursor: "pointer",
                  fontSize: 14,
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                height: hexNavHeight,
                overflow: "hidden",
                position: "relative",
              }}
            >
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
            </div>

            {/* Divider */}
            {showOutput && (
              <div
                data-divider
                style={{
                  height: 4,
                  background: isResizingPanel ? "#48bb78" : "#1f2330",
                  cursor: "ns-resize",
                  transition: isResizingPanel ? "none" : "background 0.2s",
                }}
                title="Drag to resize"
              />
            )}

            {/* Output Panel */}
            {showOutput && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    fontSize: 11,
                    color: "#8b93a7",
                    borderBottom: "1px solid #1f2330",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    userSelect: "none",
                  }}
                >
                  <span>OUTPUT</span>
                  <button
                    onClick={() => setShowOutput(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#8b93a7",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "0 4px",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ flex: 1, overflow: "hidden" }}>
                  <Output ref={outputRef} editorRef={editorRef} language={currentDocument?.language} />
                </div>
              </div>
            )}
          </div>
        )}
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
