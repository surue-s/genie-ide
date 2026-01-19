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
      bg: theme.colors.bgPanel,
      accent: theme.colors.accentMint,
      text: theme.colors.textPrimary,
    }
  }));
}

// Default theme key
export const DEFAULT_THEME = 'calm-retro-mauve';
