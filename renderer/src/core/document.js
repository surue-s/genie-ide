export function createDocument(initialCode = "", title = "") {
  return {
    id: crypto.randomUUID(),
    language: "javascript",
    text: initialCode, 
    title: title || `untitled-${crypto.randomUUID().substring(0, 4)}.js`,
    version: 1,
    updatedAt: Date.now(),
  };
}

export function updateDocument(doc, newText) {
  if (!doc) return null;
  return {
    ...doc,
    text: newText,
    version: doc.version + 1,
    updatedAt: Date.now()
  };
}

export function changeLanguage(doc, newLanguage) {
  return {
    ...doc,
    language: newLanguage
  };
}