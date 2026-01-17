// Dependency analysis for showing file relationships

/**
 * Analyzes code to find import/require statements and dependencies
 */
export function analyzeFileDependencies(documents) {
  const dependencies = {};
  
  documents.forEach(doc => {
    dependencies[doc.id] = {
      imports: [],
      importedBy: [],
      mentions: []
    };
  });

  // Analyze each document for imports and references
  documents.forEach(doc => {
    const imports = extractImports(doc.text, doc.language);
    const mentions = extractFileMentions(doc.text, documents);
    
    dependencies[doc.id].imports = imports;
    dependencies[doc.id].mentions = mentions;
    
    // Update reverse dependencies
    imports.forEach(importedFile => {
      const targetDoc = documents.find(d => 
        d.title === importedFile || 
        d.title.includes(importedFile) ||
        importedFile.includes(d.title.split('.')[0])
      );
      
      if (targetDoc && dependencies[targetDoc.id]) {
        dependencies[targetDoc.id].importedBy.push(doc.id);
      }
    });
    
    mentions.forEach(mentionedId => {
      if (dependencies[mentionedId]) {
        dependencies[mentionedId].importedBy.push(doc.id);
      }
    });
  });

  return dependencies;
}

/**
 * Extract import statements from code based on language
 */
function extractImports(code, language) {
  const imports = [];
  
  if (!code) return imports;

  switch (language) {
    case 'javascript':
    case 'typescript':
      // ES6 imports: import { x } from './file'
      const es6ImportRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = es6ImportRegex.exec(code)) !== null) {
        imports.push(cleanImportPath(match[1]));
      }
      
      // require: const x = require('./file')
      const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
      while ((match = requireRegex.exec(code)) !== null) {
        imports.push(cleanImportPath(match[1]));
      }
      break;

    case 'python':
      // import module or from module import x
      const pythonImportRegex = /(?:from\s+(\S+)\s+import|import\s+(\S+))/g;
      while ((match = pythonImportRegex.exec(code)) !== null) {
        imports.push(match[1] || match[2]);
      }
      break;

    case 'java':
      // import package.Class;
      const javaImportRegex = /import\s+([a-zA-Z0-9_.]+);/g;
      while ((match = javaImportRegex.exec(code)) !== null) {
        const parts = match[1].split('.');
        imports.push(parts[parts.length - 1]);
      }
      break;

    case 'c':
    case 'cpp':
      // #include "file.h"
      const includeRegex = /#include\s+["<]([^">]+)[">]/g;
      while ((match = includeRegex.exec(code)) !== null) {
        imports.push(cleanImportPath(match[1]));
      }
      break;

    case 'go':
      // import "package"
      const goImportRegex = /import\s+(?:\(\s*([^)]+)\s*\)|"([^"]+)")/g;
      while ((match = goImportRegex.exec(code)) !== null) {
        const importBlock = match[1] || match[2];
        if (importBlock) {
          const lines = importBlock.split('\n');
          lines.forEach(line => {
            const lineMatch = /"([^"]+)"/.exec(line);
            if (lineMatch) imports.push(lineMatch[1]);
          });
        }
      }
      break;

    case 'rust':
      // use crate::module;
      const rustUseRegex = /use\s+(?:crate::)?([a-zA-Z0-9_:]+)/g;
      while ((match = rustUseRegex.exec(code)) !== null) {
        imports.push(match[1].split('::').pop());
      }
      break;
  }

  return [...new Set(imports)]; // Remove duplicates
}

/**
 * Find mentions of other file names in comments or strings
 */
function extractFileMentions(code, documents) {
  const mentions = [];
  
  documents.forEach(doc => {
    const baseName = doc.title.split('.')[0];
    const escapedName = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedName, 'gi');
    
    if (regex.test(code)) {
      mentions.push(doc.id);
    }
  });

  return mentions;
}

/**
 * Clean up import paths
 */
function cleanImportPath(path) {
  // Remove ./ ../ and file extensions
  return path
    .replace(/^\.{0,2}\//, '')
    .replace(/\.(js|ts|jsx|tsx|py|java|c|cpp|h|hpp|go|rs)$/, '');
}

/**
 * Get dependency strength for visual weight
 */
export function getDependencyStrength(fromDoc, toDoc, dependencies) {
  if (!dependencies[fromDoc.id]) return 0;
  
  const dep = dependencies[fromDoc.id];
  const isDirectImport = dep.imports.some(imp => 
    toDoc.title.includes(imp) || imp.includes(toDoc.title.split('.')[0])
  );
  const isMentioned = dep.mentions.includes(toDoc.id);
  
  if (isDirectImport) return 3; // Strong connection
  if (isMentioned) return 1;    // Weak connection
  return 0;
}

/**
 * Get color for dependency line based on strength
 */
export function getDependencyColor(strength) {
  switch (strength) {
    case 3: return '#48bb78'; // Green for direct imports
    case 2: return '#4299e1'; // Blue for moderate
    case 1: return '#666';    // Gray for mentions
    default: return '#333';
  }
}
