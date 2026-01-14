import Parser from 'web-tree-sitter';

let parserInstance = null;
let initializationFailed = false;

export async function initTreeSitter() {
  // If initialization previously failed, don't try again
  if (initializationFailed) {
    return null;
  }
  
  if (!parserInstance) {
    try {
      // Initialize Tree-sitter with WASM
      await Parser.init({
        // Use unpkg to load the WASM file directly
        locateFile: (path) => {
          if (path.endsWith('.wasm')) {
            return 'https://unpkg.com/tree-sitter-javascript@0.25.0/tree-sitter-javascript.wasm';
          }
          return path;
        }
      });

      parserInstance = new Parser();

      // Load the JavaScript language
      const wasm = await fetch('https://unpkg.com/tree-sitter-javascript@0.25.0/tree-sitter-javascript.wasm')
        .then(res => res.arrayBuffer())
        .then(buffer => Parser.Language.of(buffer));

      parserInstance.setLanguage(wasm);
    } catch (error) {
      console.error("Failed to initialize Tree-sitter:", error);
      initializationFailed = true;
      return null;
    }
  }
  return parserInstance;
}

export async function createDocument(initialCode = "", title = "") {
  const doc = {
    id: crypto.randomUUID(),
    language: "javascript",
    text: initialCode, 
    title: title || `untitled-${crypto.randomUUID().substring(0, 4)}.js`,
    version: 1,
    updatedAt: Date.now(),
    ast: null,
    parser: null
  };

  // Try to parse the document immediately
  try {
    await parseDocument(doc);
  } catch (error) {
    console.warn("Could not parse document initially:", error);
    // Still return the document even if parsing failed
  }
  
  return doc;
}

export async function parseDocument(doc) {
  // Skip parsing if initialization failed
  if (initializationFailed) {
    return doc;
  }
  
  if (!parserInstance) {
    const parser = await initTreeSitter();
    // If parser initialization failed, skip parsing but still return the doc
    if (!parser) return doc;
  }
  
  doc.ast = parserInstance.parse(doc.text);
  return doc;
}

export async function updateDocument(doc, newText) {
  const updatedDoc = {
    ...doc,
    text: newText,
    version: doc.version + 1,
    updatedAt: Date.now()
  };
  
  // Re-parse the document with the new text
  try {
    await parseDocument(updatedDoc);
  } catch (error) {
    console.warn("Could not re-parse document:", error);
    // Still return the document with updated text even if parsing failed
    return updatedDoc;
  }
  
  return updatedDoc;
}

export function changeLanguage(doc, newLanguage) {
  return {
    ...doc,
    language: newLanguage
  };
}