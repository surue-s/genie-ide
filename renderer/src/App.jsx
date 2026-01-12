import CodeEditor from "./editor/CodeEditor"
export default function App(){

    const handleCodeChange = (code) => {
        console.log("Current code:", code);
    };
    return<CodeEditor onChange = {handleCodeChange}/>;
}