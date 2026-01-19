# Genie IDE Theme System

## Overview

Genie IDE uses a calm, retro-soft design system inspired by vintage arcade cabinets with a professional mauve color palette. The theme system is centralized and supports both dark and light themes.

## Available Themes

### 1. Calm Retro Mauve (Dark) - Default

- **Type**: Dark
- **Vibe**: Soft retro, calm, vintage arcade cabinet aesthetic
- **Primary Colors**:
  - Background: `#171322` (deep mauve)
  - Panel: `#1F1830` (soft plum)
  - Text: `#F1EAF7` (warm white)
  - Accent: `#63D2C6` (mint) for focus/interactive
  - Highlight: `#FF6FAE` (rose) for selected states

### 2. Soft Light

- **Type**: Light
- **Vibe**: Clean, professional, readable
- **Primary Colors**:
  - Background: `#FAF8FB` (pale lavender)
  - Panel: `#FFFFFF` (white)
  - Text: `#2B1F3A` (dark plum)
  - Accent: `#4FBFB3` (mint)
  - Highlight: `#E8558D` (rose)

## Theme Architecture

### 1. Theme Tokens (`renderer/src/core/theme.js`)

Central source of truth for all color tokens, organized by:

- **Base colors**: backgrounds, surfaces, borders
- **Text colors**: primary, secondary, muted
- **Accent colors**: mint, cyan, rose, peach
- **Status colors**: success, warning, error
- **UI states**: buttons, chips, focus rings
- **Editor tokens**: syntax highlighting colors

### 2. Usage in Components

All components receive the `theme` prop and use `theme.colors` to access tokens:

```jsx
function MyComponent({ theme }) {
  const colors = theme.colors;

  return (
    <div style={{ background: colors.bgPanel, color: colors.textPrimary }}>
      <button
        style={{
          background: colors.buttonBg,
          border: `1px solid ${colors.borderSubtle}`,
        }}
      >
        Click me
      </button>
    </div>
  );
}
```

### 3. Theme Control

Users can switch themes via the Theme dropdown in the header:

- Icon-based control with palette icon
- Dropdown menu with theme swatches (preview colors)
- Keyboard accessible (Tab, Enter, Esc, Arrow keys)
- Persists selection to localStorage

### 4. Monaco Editor Themes

Custom themes defined for code editor:

- **genie-dark**: Matches Calm Retro Mauve palette
- **genie-light**: Matches Soft Light palette
- Syntax token colors aligned with UI theme

## Adding a New Theme

1. **Define theme in `theme.js`**:

```javascript
export const themes = {
  "my-new-theme": {
    name: "My New Theme",
    type: "dark", // or 'light'
    colors: {
      bgApp: "#...",
      bgPanel: "#...",
      // ... all required color tokens
    },
    editor: {
      background: "#...",
      foreground: "#...",
      // ... editor-specific tokens
    },
  },
};
```

2. **Add Monaco theme in `CodeEditor.jsx`**:

```javascript
monaco.editor.defineTheme("my-theme-monaco", {
  base: "vs-dark", // or 'vs'
  inherit: false,
  rules: [
    { token: "keyword", foreground: "..." },
    // ... token rules
  ],
  colors: {
    "editor.background": "#...",
    // ... editor UI colors
  },
});
```

3. **Update theme mapping**:
   Update the `beforeMount` and theme change logic in CodeEditor to handle the new theme.

## Design Principles

1. **Consistent Spacing**: 8/12/16px rhythm
2. **Rounded Corners**: 10-14px consistently across components
3. **Soft Shadows**: Low blur, low opacity (`rgba(0,0,0,0.35)`)
4. **Gentle Transitions**: 140ms ease-out for interactions
5. **Subtle Borders**: `borderSubtle` token for panel separation
6. **Intentional Accents**: Use rose for selected, mint for focus/active
7. **Readable Contrast**: All text meets WCAG AA standards

## Accessibility

- **Focus Indicators**: All interactive elements have visible focus rings (`colors.focusRing`)
- **Keyboard Navigation**: Theme control and all UI fully keyboard accessible
- **Color Contrast**: Body text maintains minimum 4.5:1 ratio
- **Interactive Targets**: Minimum 36px height for clickable elements

## Styling Conventions

- **Border Radius**: Use `10px` (buttons/inputs) or `12-14px` (modals/panels)
- **Padding**: Consistent internal padding (12-16px)
- **Transitions**: 140ms for hover/focus, 180ms for menu animations
- **Typography**:
  - UI: 12-14px for body, 11px for labels
  - Code: Monospace at 14px
  - Headers: 16-18px

## No-No's (Anti-patterns)

❌ Hardcoded colors in components  
❌ Random gradients or heavy glows  
❌ Emoji icons (use SVG icon library)  
❌ Inconsistent border radius  
❌ Heavy animations or bouncing effects  
✅ Use theme tokens everywhere  
✅ Subtle, intentional accent colors  
✅ SVG icons with currentColor  
✅ Predictable, calm interactions
