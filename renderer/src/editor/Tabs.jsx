import React from 'react';

export default function Tabs({ documents, currentDocumentId, onSelect, onClose }) {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#1e1e1e',
      borderBottom: '1px solid #222',
      overflowX: 'auto',
      height: '35px',
      color: '#ffffff'
    }}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: currentDocumentId === doc.id ? '#2d2d2d' : '#1e1e1e',
            borderRight: '1px solid #222',
            cursor: 'pointer',
            minWidth: '120px',
            position: 'relative'
          }}
          onClick={() => onSelect(doc.id)}
        >
          <span style={{ 
            marginRight: '8px', 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {doc.title || `Untitled-${doc.id.substring(0, 4)}`}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(doc.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px',
              marginLeft: '4px'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}