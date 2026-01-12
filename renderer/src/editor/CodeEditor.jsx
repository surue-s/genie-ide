import Editor from "@monaco-editor/react";

export default function({onChange}){
    return(
        <Editor
            height= "100vh"
            defaultLanguage = "javascript"
            defaultValue = "// Start typing here"
            onChange = {(value) => onChange (value)}
        />
    );
}