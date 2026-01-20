import { useState, useRef, useEffect } from "react";
import CodeEditor from "./editor/CodeEditor";
import FolderManager from "./editor/FolderManager";
import HexFileNavigator from "./editor/HexFileNavigator";
import FileRenameModal from "./editor/FileRenameModal";
import ShortcutsHelp from "./editor/ShortcutsHelp";
import ThemeControl from "./editor/ThemeControl";
import PanelHeader from "./editor/PanelHeader";
import MusicPlayerPanel from "./editor/MusicPlayerPanel";
import { createDocument, changeLanguage } from "./core/document";
import { LANGUAGE_VERSIONS } from "./core/constants";
import { getExtensionForLanguage } from "./core/fileExtensions";
import { useKeyboardShortcuts } from "./core/shortcuts";
import { getTheme, DEFAULT_THEME } from "./core/theme";
import Output from "./editor/Output";

export default function App() {
  const initialDoc = createDocument("// Welcome to Genie IDE\n", "welcome.js", "javascript");

  const [documents, setDocuments] = useState([initialDoc]);
  const [currentDocumentId, setCurrentDocumentId] = useState(initialDoc.id);
  const [showHexNav, setShowHexNav] = useState(true);
  const [renamingDoc, setRenamingDoc] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [hexNavHeight, setHexNavHeight] = useState(300); // pixels
  const [outputHeight, setOutputHeight] = useState(250); // pixels
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false);
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('themeKey') || DEFAULT_THEME;
  });

  const currentDocument = documents.find(d => d.id === currentDocumentId);
  const theme = getTheme(currentThemeKey);
  const colors = theme.colors;

  // Handle theme change with persistence
  const handleThemeChange = (themeKey) => {
    setCurrentThemeKey(themeKey);
    localStorage.setItem('themeKey', themeKey);
  };

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
      if (e.altKey === '/') {
        setShowShortcuts(true);
      } else {
        handleKeyDown(e);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKeyDown]);

  // Panel resize handlers
  const handlePanelMouseDown = (e) => {
    if (e.target.closest('[data-divider]')) {
      setIsResizingPanel(true);
    } else if (e.target.closest('[data-right-resize]')) {
      setIsResizingRightPanel(true);
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

  useEffect(() => {
    if (isResizingRightPanel) {
      const handleMouseMove = (e) => {
        const minWidth = 260;
        const maxWidth = 600;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, window.innerWidth - e.clientX));
        setRightPanelWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizingRightPanel(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingRightPanel]);

  /* UI */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: colors.bgApp,
        color: colors.textPrimary,
        fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          background: colors.bgPanel,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleNewFile}
            style={{
              background: colors.buttonBg,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.buttonText,
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "10px",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.buttonBgHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.buttonBg}
            onFocus={(e) => e.currentTarget.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            New File
          </button>

          <button
            onClick={() => setRenamingDoc(currentDocument)}
            disabled={!currentDocument}
            style={{
              background: colors.buttonBg,
              border: `1px solid ${colors.borderSubtle}`,
              color: currentDocument ? colors.buttonText : colors.textMuted,
              padding: "8px 14px",
              cursor: currentDocument ? "pointer" : "not-allowed",
              borderRadius: "10px",
              opacity: currentDocument ? 1 : 0.6,
              fontSize: 13,
              fontWeight: 500,
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => currentDocument && (e.currentTarget.style.background = colors.buttonBgHover)}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.buttonBg}
            onFocus={(e) => currentDocument && (e.currentTarget.style.boxShadow = colors.focusRing)}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Rename
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {currentDocument && (
            <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}>
              {currentDocument.title}
            </div>
          )}
          
          <select
            value={currentDocument?.language}
            onChange={handleLanguageChange}
            style={{
              background: colors.buttonBg,
              color: colors.buttonText,
              border: `1px solid ${colors.borderSubtle}`,
              padding: "8px 12px",
              borderRadius: "10px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => e.target.style.background = colors.buttonBgHover}
            onMouseLeave={(e) => e.target.style.background = colors.buttonBg}
            onFocus={(e) => e.target.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          >
            {Object.keys(LANGUAGE_VERSIONS).map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <ThemeControl 
            currentTheme={currentThemeKey}
            onThemeChange={handleThemeChange}
          />

    
          <button
            onClick={() => setShowHexNav(!showHexNav)}
            style={{
              background: showHexNav ? colors.chipSelectedBg : colors.buttonBg,
              border: `1px solid ${showHexNav ? colors.chipSelectedBorder : colors.borderSubtle}`,
              color: showHexNav ? colors.accentRose : colors.buttonText,
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "10px",
              fontWeight: showHexNav ? 600 : 500,
              fontSize: 13,
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => {
              if (!showHexNav) e.currentTarget.style.background = colors.buttonBgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showHexNav ? colors.chipSelectedBg : colors.buttonBg;
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Graph
          </button>

          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              background: showOutput ? colors.chipSelectedBg : colors.buttonBg,
              border: `1px solid ${showOutput ? colors.chipSelectedBorder : colors.borderSubtle}`,
              color: showOutput ? colors.accentRose : colors.buttonText,
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "10px",
              fontWeight: showOutput ? 600 : 500,
              fontSize: 13,
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => {
              if (!showOutput) e.currentTarget.style.background = colors.buttonBgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showOutput ? colors.chipSelectedBg : colors.buttonBg;
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Output
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            style={{
              background: colors.buttonBg,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.buttonText,
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "10px",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 140ms ease-out",
              height: 36,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.buttonBgHover}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.buttonBg}
            onFocus={(e) => e.currentTarget.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            title="Show keyboard shortcuts"
          >
            Shortcuts
          </button>

          <button
            onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            data-music-button
            style={{
              background: showMusicPlayer ? colors.accentMint : colors.buttonBg,
              border: `1px solid ${showMusicPlayer ? colors.accentMint : colors.borderSubtle}`,
              color: showMusicPlayer ? '#000' : colors.buttonText,
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "10px",
              fontSize: 13,
              fontWeight: showMusicPlayer ? 600 : 500,
              transition: "all 140ms ease-out",
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              if (!showMusicPlayer) {
                e.currentTarget.style.background = colors.buttonBgHover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showMusicPlayer ? colors.accentMint : colors.buttonBg;
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = colors.focusRing}
            onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            title="Open ambient music player"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
            Music
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* Left Panel - Folder Manager */}
        <div
          style={{
            width: 240,
            background: colors.bgPanel,
            borderRight: `1px solid ${colors.borderSubtle}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PanelHeader
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z"/>
              </svg>
            }
            title="Files"
            theme={theme}
          />
          <FolderManager
            documents={documents}
            currentDocumentId={currentDocumentId}
            onSelect={setCurrentDocumentId}
            onClose={handleCloseFile}
            onRename={(id) => {
              const doc = documents.find(d => d.id === id);
              if (doc) setRenamingDoc(doc);
            }}
            theme={theme}
          />
        </div>

        {/* Center Panel - Code Editor (full height) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: colors.bgApp,
          }}
        >
          <PanelHeader
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            }
            title={currentDocument?.title || "Editor"}
            theme={theme}
          />
          <CodeEditor
            document={currentDocument}
            onChange={handleCodeChange}
            editorRef={editorRef}
            theme={theme}
          />
        </div>

        {/* Right Panel - Hex Navigator and Output */}
        {showHexNav && (
          <div
            style={{
              width: rightPanelWidth,
              background: colors.bgPanel,
              borderLeft: `1px solid ${colors.borderSubtle}`,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
            onMouseDown={handlePanelMouseDown}
          >
            {/* Left resize handle for right panel */}
            <div
              data-right-resize
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                cursor: "ew-resize",
                background: isResizingRightPanel ? colors.accentMint : "transparent",
                transition: isResizingRightPanel ? "none" : "background 140ms ease-out",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                if (!isResizingRightPanel) e.currentTarget.style.background = colors.borderSubtle;
              }}
              onMouseLeave={(e) => {
                if (!isResizingRightPanel) e.currentTarget.style.background = "transparent";
              }}
              title="Drag to resize panel"
            />
            {/* Hex Navigator */}
            <PanelHeader
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              }
              title="Files Map"
              theme={theme}
              actions={
                <button
                  onClick={() => setShowHexNav(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: colors.textMuted,
                    cursor: "pointer",
                    fontSize: 18,
                    padding: "0 4px",
                    transition: "color 140ms ease-out",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
                  aria-label="Close hex navigator"
                >
                  ×
                </button>
              }
            />
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
                theme={theme}
              />
            </div>

            {/* Divider */}
            {showOutput && (
              <div
                data-divider
                style={{
                  height: 1,
                  background: isResizingPanel ? colors.accentMint : colors.borderSubtle,
                  cursor: "ns-resize",
                  transition: isResizingPanel ? "none" : "background 140ms ease-out",
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
                <PanelHeader
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5"/>
                      <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                  }
                  title="Output"
                  theme={theme}
                  actions={
                    <button
                      onClick={() => setShowOutput(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: colors.textMuted,
                        cursor: "pointer",
                        fontSize: 18,
                        padding: "0 4px",
                        transition: "color 140ms ease-out",
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
                      aria-label="Close output panel"
                    >
                      ×
                    </button>
                  }
                />

                <div style={{ flex: 1, overflow: "hidden" }}>
                  <Output ref={outputRef} editorRef={editorRef} language={currentDocument?.language} theme={theme} />
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
          theme={theme}
        />
      )}

      {/* Shortcuts Help */}
      {showShortcuts && (
        <ShortcutsHelp onClose={() => setShowShortcuts(false)} theme={theme} />
      )}

      {/* Music Player Panel */}
      <MusicPlayerPanel 
        isOpen={showMusicPlayer}
        onClose={() => setShowMusicPlayer(false)}
        theme={theme}
      />
    </div>
  );
}
