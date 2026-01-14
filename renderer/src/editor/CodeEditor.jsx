import Editor from "@monaco-editor/react";
import {useState, useEffect} from "react";

export default function CodeEditor({ document, onChange }) {
  const[currentValue, setCurrentValue] = useState(document?.text || "");

    useEffect(() => {
    if (document && document.text !== currentValue) {
      setCurrentValue(document.text);
    }
  }, [document]);


  const handleChange = (value) =>{
    setCurrentValue(value);
    if(onChange){
      onChange(value);
    }
  }

      return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      onChange={(v) => onChange?.(v ?? "")}
      theme = "vs-dark"
    />
  );
}