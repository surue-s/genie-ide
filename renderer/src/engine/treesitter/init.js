import Parser from 'web-tree-sitter';

let parserInstance = null;
let initializationFailed = false;

/**
 * Initialize Tree-sitter parser
 * This should be called after React mounts, not during initial render
 */
export async function initTreeSitter() {
  if (initializationFailed) {
    return null;
  }
  
  if (!parserInstance) {
    try {
      // Initialize Tree-sitter with WASM
      await Parser.init({
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

/**
 * Get the parser instance without attempting initialization
 * This will throw if not initialized yet
 */
export function getParser() {
  if (initializationFailed) {
    return null;
  }
  
  if (!parserInstance) {
    throw new Error("Tree-sitter not initialized. Call initTreeSitter() first.");
  }
  
  return parserInstance;
}