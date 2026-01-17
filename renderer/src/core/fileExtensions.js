// File extension mappings for different languages
export const LANGUAGE_EXTENSIONS = {
  javascript: ".js",
  typescript: ".ts",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  go: ".go",
  rust: ".rs",
  php: ".php",
};

// Get file extension from language
export function getExtensionForLanguage(language) {
  return LANGUAGE_EXTENSIONS[language] || ".txt";
}

// Get language from file extension
export function getLanguageFromExtension(filename) {
  const ext = filename.substring(filename.lastIndexOf("."));
  const langMap = {
    ".js": "javascript",
    ".ts": "typescript",
    ".py": "python",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".go": "go",
    ".rs": "rs",
    ".php": "php",
  };
  return langMap[ext] || "javascript";
}

// Get file icon/color based on extension
export function getFileColor(filename) {
  const ext = filename.substring(filename.lastIndexOf("."));
  const colorMap = {
    ".js": "#f7df1e",
    ".ts": "#3178c6",
    ".py": "#3776ab",
    ".java": "#007396",
    ".c": "#555555",
    ".cpp": "#00599c",
    ".go": "#00add8",
    ".rs": "#000000",
    ".php": "#777bb4",
  };
  return colorMap[ext] || "#cccccc";
}

// Validate filename
export function isValidFilename(filename) {
  if (!filename || filename.trim() === "") return false;
  // Check for invalid characters
  const invalidChars = /[<>:"|?*\\/]/;
  return !invalidChars.test(filename);
}

// Sanitize filename
export function sanitizeFilename(filename) {
  return filename.replace(/[<>:"|?*\\/]/g, "_");
}
