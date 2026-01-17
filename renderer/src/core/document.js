import { getExtensionForLanguage } from "./fileExtensions";

export function createDocument(initialCode = "", title = "", language = "javascript") {
  const ext = getExtensionForLanguage(language);
  const defaultTitle = title || `untitled-${crypto.randomUUID().substring(0, 4)}${ext}`;
  
  return {
    id: crypto.randomUUID(),
    language: language,
    text: initialCode, 
    title: defaultTitle,
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
  const ext = getExtensionForLanguage(newLanguage);
  const baseName = doc.title.substring(0, doc.title.lastIndexOf('.')) || doc.title;
  
  return {
    ...doc,
    language: newLanguage,
    title: baseName + ext
  };
}