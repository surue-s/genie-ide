import { useState } from "react";

// File rename modal component
export default function FileRenameModal({ document, onRename, onClose }) {
  const [newName, setNewName] = useState(document.title);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError("Filename cannot be empty");
      return;
    }
    
    if (!/\.[a-z]+$/i.test(newName)) {
      setError("Please include a file extension (e.g., .js, .py)");
      return;
    }
    
    onRename(document.id, newName);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1e1e1e',
          padding: 24,
          borderRadius: 8,
          border: '1px solid #3a3d45',
          minWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 16, color: '#fff', fontSize: 16 }}>
          Rename File
        </h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#0E0F13',
              border: '1px solid #3a3d45',
              borderRadius: 4,
              color: '#fff',
              fontSize: 14,
              outline: 'none',
              marginBottom: 8,
            }}
          />
          
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2a2d35',
                border: '1px solid #3a3d45',
                borderRadius: 4,
                color: '#ccc',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#48bb78',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
