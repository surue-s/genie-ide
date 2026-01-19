import { useState } from "react";
import { getFileColor } from "../core/fileExtensions";

export default function FolderManager({ documents, currentDocumentId, onSelect, onClose, onRename, theme }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  
  const colors = theme.colors;
  const isDark = theme.type === 'dark';

  // Group files by folder
  const groupFilesByFolder = () => {
    const structure = {
      _root: [],
      _folders: {}
    };

    documents.forEach(doc => {
      const parts = doc.title.split('/');
      if (parts.length > 1) {
        const folderPath = parts.slice(0, -1).join('/');
        if (!structure._folders[folderPath]) {
          structure._folders[folderPath] = [];
        }
        structure._folders[folderPath].push(doc);
      } else {
        structure._root.push(doc);
      }
    });

    return structure;
  };

  const structure = groupFilesByFolder();

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const FileItem = ({ doc, level = 0 }) => {
    const color = getFileColor(doc.title);
    const fileName = doc.title.includes('/') ? doc.title.split('/').pop() : doc.title;
    const isActive = doc.id === currentDocumentId;
    
    return (
      <div
        key={doc.id}
        onClick={() => onSelect(doc.id)}
        style={{
          paddingLeft: `${12 + level * 16}px`,
          padding: '8px 10px',
          marginBottom: 4,
          backgroundColor: isActive ? colors.chipSelectedBg : 'transparent',
          border: `1px solid ${isActive ? colors.chipSelectedBorder : 'transparent'}`,
          color: isActive ? colors.accentRose : colors.textPrimary,
          cursor: 'pointer',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 140ms ease-out',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = colors.buttonBgHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 10, color: color }}>◆</span>
          <span style={{ 
            fontSize: 12, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            color: 'inherit'
          }}>
            {fileName}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (documents.length > 1) {
              onClose(doc.id);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.textMuted,
            cursor: documents.length > 1 ? 'pointer' : 'not-allowed',
            fontSize: 12,
            padding: '2px 6px',
            opacity: documents.length > 1 ? 0.9 : 0.4,
            transition: 'color 140ms ease-out',
          }}
          onMouseEnter={(e) => documents.length > 1 && (e.currentTarget.style.color = colors.textPrimary)}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
        >
          ×
        </button>
      </div>
    );
  };

  const FolderItem = ({ folderPath, files, level = 0 }) => {
    const isExpanded = expandedFolders.has(folderPath);
    const folderName = folderPath.split('/').pop();
    const fileCount = files.length;

    return (
      <div key={folderPath}>
        <div
          onClick={() => toggleFolder(folderPath)}
          style={{
            paddingLeft: `${12 + level * 16}px`,
            padding: '8px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: colors.textSecondary,
            fontSize: 12,
            userSelect: 'none',
            transition: 'background-color 140ms ease-out',
            borderRadius: 10,
            marginBottom: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.buttonBgHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span style={{ fontSize: 11, minWidth: 12, color: colors.textMuted }}>
            {isExpanded ? '▾' : '▸'}
          </span>
          <span style={{ fontSize: 11, color: colors.textSecondary }}>▢</span>
          <span style={{ fontWeight: 600 }}>{folderName}</span>
          <span style={{ fontSize: 11, color: colors.textMuted, marginLeft: 'auto' }}>
            {fileCount}
          </span>
        </div>
        {isExpanded && files.map(doc => <FileItem key={doc.id} doc={doc} level={level + 1} />)}
      </div>
    );
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.bgPanel,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px',
        }}
      >
        {/* Root files */}
        {structure._root.length > 0 && (
          <div>
            {structure._root.map(doc => (
              <FileItem key={doc.id} doc={doc} level={0} />
            ))}
          </div>
        )}

        {/* Folders */}
        {Object.entries(structure._folders).map(([folderPath, files]) => (
          <FolderItem
            key={folderPath}
            folderPath={folderPath}
            files={files}
            level={0}
          />
        ))}

        {documents.length === 0 && (
          <div
            style={{
              padding: '12px',
              color: colors.textMuted,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            No files open
          </div>
        )}
      </div>
    </div>
  );
}
