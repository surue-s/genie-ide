import { getParser } from './init';

/**
 * Parse text with Tree-sitter
 * This function should be called only after Tree-sitter is initialized
 */
export function parseText(text) {
  try {
    const parser = getParser();
    if (!parser) {
      return null;
    }
    
    return parser.parse(text);
  } catch (error) {
    console.warn("Parse failed:", error);
    return null;
  }
}

/**
 * Parse a document object
 * Returns the AST or null if parsing fails
 */
export function parseDocument(doc) {
  if (!doc || !doc.text) {
    return null;
  }
  
  return parseText(doc.text);
}