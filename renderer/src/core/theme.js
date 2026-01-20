// Theme tokens for Genie IDE
// Calm Retro Mauve palette - inspired by vintage arcade cabinets

export const themes = {
  'calm-retro-mauve': {
    name: 'Calm Retro Mauve',
    type: 'dark',
    colors: {
      // Base backgrounds
      bgApp: '#171322',
      bgPanel: '#1F1830',
      bgPanelAlt: '#241C38',
      surfaceRaised: '#2B2142',
      
      // Borders
      borderSubtle: '#3A2D57',
      borderFocus: '#63D2C6',
      
      // Text
      textPrimary: '#F1EAF7',
      textSecondary: '#C9BEDA',
      textMuted: '#9C8FB4',
      
      // Accents
      accentMint: '#63D2C6',
      accentCyan: '#74B7FF',
      accentRose: '#FF6FAE',
      accentPeach: '#F2B6A0',
      
      // Status
      warning: '#F6C177',
      error: '#FF5C7A',
      success: '#7BE3B1',
      
      // Shadow
      shadow: 'rgba(0,0,0,0.35)',
      
      // UI States
      buttonBg: '#2B2142',
      buttonBgHover: '#342652',
      buttonBgActive: '#3A2D57',
      buttonText: '#F1EAF7',
      chipSelectedBg: 'rgba(255,111,174,0.16)',
      chipSelectedBorder: '#FF6FAE',
      focusRing: '0 0 0 3px rgba(99,210,198,0.35)',
    },
    editor: {
      background: '#161226',
      foreground: '#F1EAF7',
      selectionBg: 'rgba(99,210,198,0.18)',
      lineHighlight: 'rgba(255,255,255,0.04)',
      cursor: '#63D2C6',
      
      // Token colors
      comment: '#9C8FB4',
      keyword: '#74B7FF',
      string: '#7BE3B1',
      number: '#F6C177',
      function: '#FF6FAE',
      type: '#F2B6A0',
      variable: '#F1EAF7',
      punctuation: '#C9BEDA',
    }
  },
  'soft-light': {
    name: 'Soft Light',
    type: 'light',
    colors: {
      bgApp: '#FAF8FB',
      bgPanel: '#FFFFFF',
      bgPanelAlt: '#F5F2F7',
      surfaceRaised: '#EFEDF1',
      
      borderSubtle: '#E0DBE5',
      borderFocus: '#63D2C6',
      
      textPrimary: '#2B1F3A',
      textSecondary: '#5A4F6B',
      textMuted: '#8C7FA3',
      
      accentMint: '#4FBFB3',
      accentCyan: '#5A9FE8',
      accentRose: '#E8558D',
      accentPeach: '#D9957B',
      
      warning: '#D9A555',
      error: '#E84A68',
      success: '#5FC994',
      
      shadow: 'rgba(43,31,58,0.12)',
      
      buttonBg: '#EFEDF1',
      buttonBgHover: '#E5E2E8',
      buttonBgActive: '#DCD8E0',
      buttonText: '#2B1F3A',
      chipSelectedBg: 'rgba(232,85,141,0.12)',
      chipSelectedBorder: '#E8558D',
      focusRing: '0 0 0 3px rgba(79,191,179,0.35)',
    },
    editor: {
      background: '#FFFFFF',
      foreground: '#2B1F3A',
      selectionBg: 'rgba(79,191,179,0.15)',
      lineHighlight: 'rgba(43,31,58,0.03)',
      cursor: '#4FBFB3',
      
      comment: '#8C7FA3',
      keyword: '#5A9FE8',
      string: '#5FC994',
      number: '#D9A555',
      function: '#E8558D',
      type: '#D9957B',
      variable: '#2B1F3A',
      punctuation: '#5A4F6B',
    }
  },
  'soft-purple-pink': {
    name: 'Soft Purple-Pink',
    type: 'dark',
    colors: {
      // Base backgrounds
      bgApp: '#140F1F',
      bgPanel: '#1C152B',
      bgPanelAlt: '#221A35',
      surfaceRaised: '#261E3D',
      
      // Borders
      borderSubtle: '#3A2D55',
      borderFocus: '#C7A8FF',
      
      // Text
      textPrimary: '#F3E9FF',
      textSecondary: '#D6C9F0',
      textMuted: '#A894C9',
      
      // Accents
      accentMint: '#E3A6D8',
      accentCyan: '#B99CFF',
      accentRose: '#F0C1E8',
      accentPeach: '#E3A6D8',
      
      // Status
      warning: '#F0C1E8',
      error: '#FF9DB0',
      success: '#9EE5C0',
      
      // Shadow
      shadow: 'rgba(0,0,0,0.35)',
      
      // UI States
      buttonBg: '#261E3D',
      buttonBgHover: '#322657',
      buttonBgActive: '#3C2D66',
      buttonText: '#140F1F',
      chipSelectedBg: 'rgba(227,166,216,0.16)',
      chipSelectedBorder: '#E3A6D8',
      focusRing: '0 0 0 3px rgba(199,168,255,0.35)',
    },
    editor: {
      background: '#120D1B',
      foreground: '#F3E9FF',
      selectionBg: 'rgba(227, 166, 216, 0.25)',
      lineHighlight: 'rgba(255,255,255,0.04)',
      cursor: '#E3A6D8',
      
      // Token colors
      comment: '#7E6A9C',
      keyword: '#C6A6FF',
      string: '#F1B6D1',
      number: '#E6C8FF',
      function: '#AFCBFF',
      type: '#D8B4FF',
      variable: '#F3E9FF',
      punctuation: '#D6C9F0',
    }
  }
};

// Get theme by key
export function getTheme(key) {
  return themes[key] || themes['calm-retro-mauve'];
}

// Get all available themes for selection
export function getAvailableThemes() {
  return Object.entries(themes).map(([key, theme]) => ({
    key,
    name: theme.name,
    type: theme.type,
   preview: {
  background: theme.colors.bgPanel,
  surface: theme.colors.surfaceRaised,
  border: theme.colors.borderSubtle,
  accent: theme.colors.accentRose,
  textPrimary: theme.colors.textPrimary,
  textSecondary: theme.colors.textMuted,
}

  }));
}

// Default theme key
export const DEFAULT_THEME = 'calm-retro-mauve';