export function createDocument(initialCode = ""){
return {
    id:crypto.randomUUID(),
    language: "javascript",
    text: initialCode, 
    version: 1,
    updatedAt: Date.now(),
};
}

export function updateDocument(document, newText){
    return {
        ...doc, 
        text: newText, 
        version: document.version +1,
        updatedAt: Date.now
    }
}
export function changeLanguage(doc, newLanguage){
    return {
        ...doc, 
        language: newLanguage
    }
}