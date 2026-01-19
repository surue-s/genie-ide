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
        background: "#f6f2f4",
        color: "#2e2a2f",
        fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e8dfe6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          background: "#fbf8fa",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleNewFile}
            style={{
              background: "#f1ebef",
              border: "1px solid #e2d8e0",
              color: "#2e2a2f",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 120ms ease-out",
              hover: { background: "#ede7eb" },
            }}
            onMouseEnter={(e) => e.target.style.background = "#ede7eb"}
            onMouseLeave={(e) => e.target.style.background = "#f1ebef"}
          >
            + New File
          </button>

          <button
            onClick={() => setRenamingDoc(currentDocument)}
            disabled={!currentDocument}
            style={{
              background: "#f1ebef",
              border: "1px solid #e2d8e0",
              color: currentDocument ? "#2e2a2f" : "#c0b8c5",
              padding: "8px 14px",
              cursor: currentDocument ? "pointer" : "not-allowed",
              borderRadius: "8px",
              opacity: currentDocument ? 1 : 0.6,
              fontSize: 13,
              fontWeight: 500,
              transition: "all 120ms ease-out",
            }}
            onMouseEnter={(e) => currentDocument && (e.target.style.background = "#ede7eb")}
            onMouseLeave={(e) => e.target.style.background = "#f1ebef"}
          >
            ✏️ Rename
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {currentDocument && (
            <div style={{ fontSize: 12, color: "#5f5a63", fontWeight: 500 }}>
              {currentDocument.title}
            </div>
          )}
          
          <select
            value={currentDocument?.language}
            onChange={handleLanguageChange}
            style={{
              background: "#f1ebef",
              color: "#2e2a2f",
              border: "1px solid #e2d8e0",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 120ms ease-out",
            }}
            onMouseEnter={(e) => e.target.style.background = "#ede7eb"}
            onMouseLeave={(e) => e.target.style.background = "#f1ebef"}
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
              background: showHexNav ? "#c89fb6" : "#f1ebef",
              border: "1px solid" + (showHexNav ? "#b88aa5" : "#e2d8e0"),
              color: showHexNav ? "#fff" : "#2e2a2f",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "8px",
              fontWeight: showHexNav ? 600 : 500,
              fontSize: 13,
              transition: "all 120ms ease-out",
            }}
            onMouseEnter={(e) => {
              if (!showHexNav) e.target.style.background = "#ede7eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = showHexNav ? "#c89fb6" : "#f1ebef";
            }}
          >
            📊 Graph
          </button>

          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              background: showOutput ? "#b8a4c9" : "#f1ebef",
              border: "1px solid" + (showOutput ? "#a593b8" : "#e2d8e0"),
              color: showOutput ? "#fff" : "#2e2a2f",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "8px",
              fontWeight: showOutput ? 600 : 500,
              fontSize: 13,
              transition: "all 120ms ease-out",
            }}
            onMouseEnter={(e) => {
              if (!showOutput) e.target.style.background = "#ede7eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = showOutput ? "#b8a4c9" : "#f1ebef";
            }}
          >
            ▼ Output
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            style={{
              background: "#f1ebef",
              border: "1px solid #e2d8e0",
              color: "#2e2a2f",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 120ms ease-out",
            }}
            onMouseEnter={(e) => e.target.style.background = "#ede7eb"}
            onMouseLeave={(e) => e.target.style.background = "#f1ebef"}
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
            width: 240,
            background: "#fbf8fa",
            borderRight: "1px solid #e8dfe6",
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
            background: "#f6f2f4",
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
              background: "#fbf8fa",
              borderLeft: "1px solid #e8dfe6",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseDown={handlePanelMouseDown}
          >
            {/* Hex Navigator */}
            <div
              style={{
                padding: "12px 16px",
                fontSize: 12,
                color: "#5f5a63",
                borderBottom: "1px solid #e8dfe6",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <span>Files Map</span>
              <button
                onClick={() => setShowHexNav(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8c8791",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: "0 4px",
                  transition: "color 120ms ease-out",
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e2a2f"}
                onMouseLeave={(e) => e.target.style.color = "#8c8791"}
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
                  height: 1,
                  background: isResizingPanel ? "#c89fb6" : "#e2d8e0",
                  cursor: "ns-resize",
                  transition: isResizingPanel ? "none" : "background 120ms ease-out",
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
                    padding: "12px 16px",
                    fontSize: 12,
                    color: "#5f5a63",
                    borderBottom: "1px solid #e8dfe6",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    userSelect: "none",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Output</span>
                  <button
                    onClick={() => setShowOutput(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#8c8791",
                      cursor: "pointer",
                      fontSize: 18,
                      padding: "0 4px",
                      transition: "color 120ms ease-out",
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#2e2a2f"}
                    onMouseLeave={(e) => e.target.style.color = "#8c8791"}
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
