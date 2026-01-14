import { useState, useEffect } from 'react';
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import TreeView from "./editor/TreeView";
import { createDocument, updateDocument } from "./core/document";
import { initTreeSitter } from "./engine/treesitter/init";
import { parseDocument } from "./engine/treesitter/parse";

export default function App() {
  // Initialize with one document synchronously
  const [documents, setDocuments] = useState([]);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [activePanel, setActivePanel] = useState('info'); // 'info', 'ast'
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const [parsedAst, setParsedAst] = useState(null);

  // Initialize the first document synchronously and Tree-sitter separately
  useEffect(() => {
    // Create initial document synchronously
    const initialDoc = createDocument("// Welcome to Genie IDE\n// Start coding here...");
    initialDoc.title = "welcome.js"; // Add a title property
    
    setDocuments([initialDoc]);
    setCurrentDocumentId(initialDoc.id);
    
    // Initialize Tree-sitter separately, after UI renders
    const initializeTreeSitterAsync = async () => {
      try {
        await initTreeSitter();
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Tree-sitter:", error);
        setInitError(error.message);
        setIsLoading(false);
      }
    };
    
    initializeTreeSitterAsync();
  }, []);

  // Update AST when current document changes
  useEffect(() => {
    if (currentDocumentId) {
      const doc = documents.find(d => d.id === currentDocumentId);
      if (doc) {
        // Parse the document separately from UI updates
        const ast = parseDocument(doc);
        setParsedAst(ast);
      }
    }
  }, [currentDocumentId, documents]);

  const currentDocument = documents.find(doc => doc.id === currentDocumentId);

  const handleCodeChange = (code) => {
    if (currentDocument) {
      // Update document synchronously without blocking UI
      const updatedDoc = updateDocument(currentDocument, code);
      
      setDocuments(docs => 
        docs.map(doc => doc.id === currentDocumentId ? updatedDoc : doc)
      );
      
      // Parse the updated document separately
      const ast = parseDocument(updatedDoc);
      setParsedAst(ast);
    }
  };

  const handleNewFile = async () => {
    const newDoc = createDocument("// New file\n// Start coding here...");
    newDoc.title = `untitled-${newDoc.id.substring(0, 4)}.js`;
    setDocuments(docs => [...docs, newDoc]);
    setCurrentDocumentId(newDoc.id);
  };

  const handleCloseTab = (docId) => {
    const remainingDocs = documents.filter(doc => doc.id !== docId);
    
    if (remainingDocs.length === 0) {
      // If we're closing the last document, create a new one
      const fallbackDoc = createDocument("// Welcome to Genie IDE\n// Start coding here...");
      fallbackDoc.title = "welcome.js";
      setDocuments([fallbackDoc]);
      setCurrentDocumentId(fallbackDoc.id);
    } else {
      setDocuments(remainingDocs);
      
      // If we closed the current document, switch to the first remaining document
      if (docId === currentDocumentId) {
        setCurrentDocumentId(remainingDocs[0].id);
      }
    }
  };

  const handleSelectTab = (docId) => {
    setCurrentDocumentId(docId);
  };

  if (initError) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#ff6b6b",
        padding: "20px",
        textAlign: "center"
      }}>
        <div>
          <h2>Error initializing Genie IDE</h2>
          <p>{initError}</p>
          <p>Please check the console for more details.</p>
          <p>UI is still functional but AST features may not work.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
    }}>
      {/* Top Tab Bar */}
      <Tabs
        documents={documents}
        currentDocumentId={currentDocumentId}
        onSelect={handleSelectTab}
        onClose={handleCloseTab}
      />

      {/* Main Content Area */}
      <div style={{ 
        display: "flex",
        flex: 1,
        overflow: "hidden"
      }}>
        {/* Left Panel - File Explorer */}
        <div style={{ 
          width: "240px", 
          borderRight: "1px solid #222",
          backgroundColor: "#1e1e1e",
          color: "#ccc",
          padding: "10px"
        }}>
          <h3>File Explorer</h3>
          <button onClick={handleNewFile}>
            New File
          </button>
          <div style={{ marginTop: "20px" }}>
            <p>Open Files: {documents.length}</p>
            <p>Current: {currentDocument?.title || 'None'}</p>
          </div>
        </div>
          
        {/* Main Code Editor */}
        <div style={{ flex: 1 }}>
          {currentDocument ? (
            <CodeEditor 
              document={currentDocument} 
              onChange={handleCodeChange} 
            />
          ) : (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor: "#1e1e1e",
              color: "#ccc"
            }}>
              No document selected
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ 
          width: "260px", 
          borderLeft: "1px solid #222",
          backgroundColor: "#1e1e1e",
          color: "#ccc",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid #222"
          }}>
            <button 
              style={{ 
                flex: 1, 
                background: activePanel === 'info' ? '#2d2d2d' : 'transparent',
                border: 'none',
                color: '#ccc',
                padding: '8px'
              }}
              onClick={() => setActivePanel('info')}
            >
              Info
            </button>
            <button 
              style={{ 
                flex: 1, 
                background: activePanel === 'ast' ? '#2d2d2d' : 'transparent',
                border: 'none',
                color: '#ccc',
                padding: '8px'
              }}
              onClick={() => setActivePanel('ast')}
            >
              AST
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {activePanel === 'info' ? (
              <div style={{ padding: "10px" }}>
                <h3>Information</h3>
                {currentDocument ? (
                  <>
                    <p>Document ID: {currentDocument.id.substring(0, 8)}...</p>
                    <p>Title: {currentDocument.title}</p>
                    <p>Language: {currentDocument.language}</p>
                    <p>Version: {currentDocument.version}</p>
                    <p>Last Updated: {new Date(currentDocument.updatedAt).toLocaleString()}</p>
                    <p>AST Ready: {parsedAst ? 'Yes' : 'No'}</p>
                  </>
                ) : (
                  <p>No document selected</p>
                )}
              </div>
            ) : (
              <TreeView document={currentDocument} ast={parsedAst} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}