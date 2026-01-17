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
  const [showOutput, setShowOutput] = useState(false);
  const [outputHeight, setOutputHeight] = useState(250); // pixels
  const [outputPosition, setOutputPosition] = useState({ top: 100, left: 100 });
  const [isResizingOutput, setIsResizingOutput] = useState(false);
  const [isDraggingOutput, setIsDraggingOutput] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [hexNavSize, setHexNavSize] = useState({ width: 350, height: 300 });

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
  const handleOutputMouseDown = (e) => {
    if (e.target.closest('[data-output-header]')) {
      setIsDraggingOutput(true);
      setDragOffset({
        x: e.clientX - outputPosition.left,
        y: e.clientY - outputPosition.top,
      });
    } else if (e.target.closest('[data-output-resize]')) {
      setIsResizingOutput(true);
    }
  };

  useEffect(() => {
    if (isDraggingOutput) {
      const handleMouseMove = (e) => {
        setOutputPosition({
          left: e.clientX - dragOffset.x,
          top: e.clientY - dragOffset.y,
        });
      };

      const handleMouseUp = () => {
        setIsDraggingOutput(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingOutput, dragOffset]);

  useEffect(() => {
    if (isResizingOutput) {
      const handleMouseMove = (e) => {
        const newHeight = Math.max(200, e.clientY - outputPosition.top - 30);
        setOutputHeight(newHeight);
      };

      const handleMouseUp = () => {
        setIsResizingOutput(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingOutput, outputPosition]);

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
            {showHexNav ? "�️ Graph" : "📝 Hide"}
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

      {/* Main content area */}
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

        {/* Floating Hex Navigator - Top Right */}
        {showHexNav && (
          <div
            style={{
              position: "fixed",
              top: 60,
              right: 20,
              width: hexNavSize.width,
              height: hexNavSize.height,
              background: "#111318",
              border: "1px solid #2a2f3d",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              zIndex: 100,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
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
                cursor: "move",
                userSelect: "none",
              }}
              data-hex-header
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
                flex: 1,
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
          </div>
        )}

        {/* Floating Output Panel */}
        {showOutput && (
          <div
            onMouseDown={handleOutputMouseDown}
            style={{
              position: "fixed",
              top: outputPosition.top,
              left: outputPosition.left,
              width: 500,
              height: outputHeight,
              background: "#111318",
              border: "1px solid #2a2f3d",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              zIndex: 200,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header - Draggable */}
            <div
              data-output-header
              style={{
                padding: "8px 10px",
                fontSize: 11,
                color: "#8b93a7",
                borderBottom: "1px solid #1f2330",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "move",
                userSelect: "none",
                background: isDraggingOutput ? "#1a1d27" : "#111318",
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

            {/* Content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Output ref={outputRef} editorRef={editorRef} language={currentDocument?.language} />
            </div>

            {/* Resize Handle - Bottom Right */}
            <div
              data-output-resize
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                cursor: "nwse-resize",
                background: isResizingOutput ? "rgba(72, 187, 120, 0.3)" : "transparent",
              }}
              title="Drag to resize"
            />
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
