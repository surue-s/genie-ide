// Editor bridge for safe, non-breaking integration of course features.
// All features are disabled by default; enable them incrementally after validation.

export const EditorBridge = {
  // Highlights: ranges to mark during lessons. Default: disabled
  highlights: {
    enabled: false, // Set to true only after testing with real lessons
    ranges: [], // Array of { from, to, class } for CodeMirror decorations
  },

  // Locking: prevent edits outside allowed zones. Default: disabled
  locking: {
    enabled: false, // Set to true only after testing
    allowedRanges: [], // Array of { from, to } where user can edit
  },

  // Inline explanations: hover on tokens to see context. Default: disabled
  inlineExplanations: {
    enabled: false, // Future feature
    explanations: {}, // Map of token text to explanation
  },

  // Safe setters that validate before updating
  setHighlights(ranges) {
    if (!Array.isArray(ranges)) throw new Error("Highlights must be an array");
    if (this.highlights.enabled) {
      this.highlights.ranges = ranges;
      return true;
    }
    return false;
  },

  setLocking(allowedRanges) {
    if (!Array.isArray(allowedRanges)) throw new Error("Locking ranges must be an array");
    if (this.locking.enabled) {
      this.locking.allowedRanges = allowedRanges;
      return true;
    }
    return false;
  },

  // Safe reset
  reset() {
    this.highlights.ranges = [];
    this.locking.allowedRanges = [];
  },

  // Future hook for editor's onChange to validate locked zones
  validateEdit(from, to) {
    if (!this.locking.enabled) return true;
    if (this.locking.allowedRanges.length === 0) return true;
    return this.locking.allowedRanges.some(range => from >= range.from && to <= range.to);
  },
};
