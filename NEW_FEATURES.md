# Genie IDE - New Features Guide

## 🎉 What's New

### 1. **Hexagonal File Navigator** (Apple Watch Style)

- Click the **🔷 Hex View** button to toggle between editor and hex navigation
- Interactive honeycomb layout of all your open files
- **Drag** to pan around
- **Scroll** to zoom in/out
- **Click** hexagons to switch files
- **Hover** to see file names
- Color-coded by file extension

### 2. **Proper File Management**

- ✅ Automatic file extensions based on language (.js, .py, .java, etc.)
- ✅ Rename files with the **Rename File** button
- ✅ Close files with X on tabs
- ✅ File count display in sidebar
- ✅ Extension-aware file naming

### 3. **Keyboard Shortcuts**

Press **?** anytime to see all shortcuts, or use:

| Shortcut         | Action              |
| ---------------- | ------------------- |
| `Ctrl+N`         | New file            |
| `Ctrl+W`         | Close current file  |
| `Ctrl+R`         | Rename file         |
| `Ctrl+Enter`     | Run code            |
| `Ctrl+H`         | Toggle hex view     |
| `Ctrl+Tab`       | Next tab            |
| `Ctrl+Shift+Tab` | Previous tab        |
| `?`              | Show shortcuts help |

### 4. **Enhanced Code Editor**

- ✅ **Home/End keys now work properly**
- ✅ Word wrap enabled
- ✅ Smooth scrolling and cursor animation
- ✅ Auto-closing brackets and quotes
- ✅ Format on paste and type
- ✅ Better IntelliSense suggestions

### 5. **Improved UI**

- ✅ Modern dark theme
- ✅ Better button styling with rounded corners
- ✅ Help button with ? icon
- ✅ File counter in sidebar
- ✅ Keyboard shortcut hints

## 🚀 How to Use

### Creating Files

1. Click **+ New File** or press `Ctrl+N`
2. Files are automatically named with proper extensions
3. Change language in dropdown to update extension

### Renaming Files

1. Click **Rename File** button or press `Ctrl+R`
2. Enter new name **with extension** (e.g., `main.py`)
3. Click **Rename**

### Hex Navigation View

1. Click **🔷 Hex View** or press `Ctrl+H`
2. Drag to move around the hexagon field
3. Scroll mouse wheel to zoom in/out
4. Click any hexagon to open that file
5. Hover to see full filename
6. Click X on hex to close file (if more than 1 open)

### Running Code

1. Write your code in the editor
2. Click **Run Code** button or press `Ctrl+Enter`
3. See output in the right panel
4. Errors are highlighted in red

## 📁 File Structure

```
renderer/src/
├── core/
│   ├── constants.js          # Language versions
│   ├── document.js            # Document management
│   ├── fileExtensions.js      # Extension mappings
│   └── shortcuts.js           # Keyboard shortcuts
├── editor/
│   ├── CodeEditor.jsx         # Monaco editor wrapper
│   ├── FileRenameModal.jsx    # Rename dialog
│   ├── HexFileNavigator.jsx   # Hexagonal file view
│   ├── Output.jsx             # Code execution output
│   ├── ShortcutsHelp.jsx      # Shortcuts help modal
│   └── Tabs.jsx               # File tabs
├── api.js                     # Piston API integration
└── App.jsx                    # Main application
```

## 🎨 Design Philosophy

Following the Genie IDE vision from the project document:

- **Beginner-first**: Clear, intuitive interface
- **Learning-focused**: Helpful hints and shortcuts
- **No overwhelm**: Progressive feature discovery
- **Visual clarity**: Hexagonal navigation for spatial file organization
- **Accessibility**: Keyboard shortcuts for efficiency

## 🔧 Technical Details

### File Extensions

Automatic extension mapping for all supported languages:

- JavaScript: `.js`
- TypeScript: `.ts`
- Python: `.py`
- Java: `.java`
- C: `.c`
- C++: `.cpp`
- Go: `.go`
- Rust: `.rs`
- PHP: `.php`

### Keyboard Navigation

All major IDE functions accessible via keyboard for power users while maintaining discoverability for beginners.

### Code Execution

Uses Piston API (https://emkc.org/api/v2/piston) for secure code execution in multiple languages without local setup.

## 🐛 Known Issues & Future Enhancements

- [ ] Persistent file storage (currently session-only)
- [ ] Syntax error highlighting before execution
- [ ] Auto-save functionality
- [ ] Multi-file project support
- [ ] Git integration
- [ ] Collaborative editing

## 💡 Tips

- Press **?** frequently until you learn the shortcuts
- Use hex view when managing many files
- Switch languages to auto-update file extensions
- The editor remembers your cursor position per file

Enjoy coding with Genie IDE! 🧞‍♂️✨
