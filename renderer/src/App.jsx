import { useState } from 'react';
import CodeEditor from "./editor/CodeEditor";
import Tabs from "./editor/Tabs";
import { createDocument } from "./core/document";

export default function App() {
  // Initialize with one document
  const initialDoc = createDocument("// Welcome to Genie IDE\n// Start coding here...");
  initialDoc.title = "welcome.js"; // Add a title property
  
  const [documents, setDocuments] = useState([initialDoc]);
  const [currentDocumentId, setCurrentDocumentId] = useState(initialDoc.id);

  const currentDocument = documents.find(doc => doc.id === currentDocumentId);

  const handleCodeChange = (code) => {
    if (currentDocument) {
      const updatedDoc = {
        ...currentDocument,
        text: code,
        version: currentDocument.version + 1,
        updatedAt: Date.now()
      };
      
      setDocuments(docs => 
        docs.map(doc => doc.id === currentDocumentId ? updatedDoc : doc)
      );
    }
  };

  const handleNewFile = () => {
    const newDoc = createDocument("// New file\n// Start coding here...");
    newDoc.title = `untitled-${newDoc.id.substring(0, 4)}.js`;
    setDocuments(docs => [...docs, newDoc]);
    setCurrentDocumentId(newDoc.id);
  };

  const handleCloseTab = (docId) => {
    const remainingDocs = documents.filter(doc => doc.id !== docId);
    
    if (remainingDocs.length === 0) {
      // If we're closing the last document, create a new one
      const newDoc = createDocument("// Welcome to Genie IDE\n// Start coding here...");
      newDoc.title = "welcome.js";
      setDocuments([newDoc]);
      setCurrentDocumentId(newDoc.id);
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
          padding: "10px"
        }}>
          <h3>Information</h3>
          {currentDocument ? (
            <>
              <p>Document ID: {currentDocument.id.substring(0, 8)}...</p>
              <p>Title: {currentDocument.title}</p>
              <p>Language: {currentDocument.language}</p>
              <p>Version: {currentDocument.version}</p>
              <p>Last Updated: {new Date(currentDocument.updatedAt).toLocaleString()}</p>
            </>
          ) : (
            <p>No document selected</p>
          )}
        </div>
      </div>
    </div>
  );
}