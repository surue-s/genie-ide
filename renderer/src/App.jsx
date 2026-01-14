import { version } from "react";
import { createDocument } from "./core/document";
import CodeEditor from "./editor/CodeEditor";
import {useState} from 'react';
export default function App() {

  const[currentDocument, setCurrentDocument] = useState(
    createDocument("//test this test tetsets")
  )
  const handleCodeChange=(code)=>{
    setCurrentDocument(prev => ({
      ...prev,
      text:code,
      version:prev.version+1,
      updatedAt: Date.now()
    }));
  }

  return (
    <div style={{ display:"flex",
      height: "100vh",
      width: "100vw",
     }}>
{/*left*/}
      <div style = {{ width: "240px", borderRight: "1px solid #222", backgroundColor: "#333", color:"#ccc", padding:"10px"}}>
     <h3> File Explorer </h3>
     <button onClick = {()=>{
      const newDoc = createDocument("//New File");
      setCurrentDocument(newDoc);
     }}>
      New File
    </button>
      </div>
       
{/*Main Code editor layout*/}
        <div style = {{flex:1}}>
          <CodeEditor
          document={currentDocument}
          onChange={handleCodeChange}
          />
        </div>
{/*right panel*/}
        <div style= {{width: "260px", borderLeft: "1px solid #222", bakcgroundColor: "#1e1e1e", color:"#f200f2", padding:"10px"}}>
          <h3>Information</h3>
        <p>Document ID: {currentDocument.id}</p>
        <p>Last Updated: {new Date(currentDocument.updatedAt).toLocaleString()}</p>
        </div>
    </div>
  );
}

