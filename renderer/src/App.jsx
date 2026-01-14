import { useState, useEffect } from 'react';
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import TreeView from "./editor/TreeView";
import { createDocument, updateDocument, initTreeSitter } from "./core/document";

export default function App() {
  // Initialize with one document
  const [documents, setDocuments] = useState([]);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [activePanel, setActivePanel] = useState('info'); // 'info', 'ast'
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  // Initialize the first document and Tree-sitter
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Tree-sitter
        await initTreeSitter();
        
        // Create initial document
        const initialDoc = await createDocument("// Welcome to Genie IDE\n// Start coding here...");
        initialDoc.title = "welcome.js"; // Add a title property
        
        setDocuments([initialDoc]);
        setCurrentDocumentId(initialDoc.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setInitError(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const currentDocument = documents.find(doc => doc.id === currentDocumentId);

  const handleCodeChange = async (code) => {
    if (currentDocument) {
      try {
        const updatedDoc = await updateDocument(currentDocument, code);
        
        setDocuments(docs => 
          docs.map(doc => doc.id === currentDocumentId ? updatedDoc : doc)
        );
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleNewFile = async () => {
    try {
      const newDoc = await createDocument("// New file\n// Start coding here...");
      newDoc.title = `untitled-${newDoc.id.substring(0, 4)}.js`;
      setDocuments(docs => [...docs, newDoc]);
      setCurrentDocumentId(newDoc.id);
    } catch (error) {
      console.error("Error creating new file:", error);
    }
  };

  const handleCloseTab = (docId) => {
    const remainingDocs = documents.filter(doc => doc.id !== docId);
    
    if (remainingDocs.length === 0) {
      // If we're closing the last document, create a new one
      createDocument("// Welcome to Genie IDE\n// Start coding here...")
        .then(newDoc => {
          newDoc.title = "welcome.js";
          setDocuments([newDoc]);
          setCurrentDocumentId(newDoc.id);
        })
        .catch(error => {
          console.error("Error creating fallback document:", error);
        });
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

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#ccc"
      }}>
        Initializing Genie IDE...
      </div>
    );
  }

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
                    <p>AST Ready: {currentDocument.ast ? 'Yes' : 'No'}</p>
                  </>
                ) : (
                  <p>No document selected</p>
                )}
              </div>
            ) : (
              <TreeView document={currentDocument} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}