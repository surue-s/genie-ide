import { useState, useEffect, useRef } from "react";
import { getFileColor } from "../core/fileExtensions";

// Hexagonal file navigator inspired by Apple Watch
export default function HexFileNavigator({ documents, currentDocumentId, onSelect, onClose, onRename }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);

  // Calculate hexagon positions in a honeycomb pattern
  const getHexPosition = (index, total) => {
    const hexSize = 70;
    const hexSpacing = 85;
    
    // Create spiral pattern
    if (index === 0) return { x: 0, y: 0 };
    
    let ring = 1;
    let posInRing = index - 1;
    let itemsInPrevRings = 0;
    
    while (posInRing >= ring * 6) {
      itemsInPrevRings += ring * 6;
      posInRing -= ring * 6;
      ring++;
    }
    
    const angle = (posInRing / (ring * 6)) * Math.PI * 2;
    const radius = ring * hexSpacing;
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('hex-drag-area')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Hexagon component
  const Hexagon = ({ doc, position, isActive, onHexClick, onHexClose }) => {
    const color = getFileColor(doc.title);
    const size = 60;
    
    return (
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={() => setHoveredId(doc.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div
          onClick={() => onHexClick(doc.id)}
          style={{
            position: 'relative',
            width: size,
            height: size * 1.15,
            transition: 'transform 0.2s ease',
            transform: hoveredId === doc.id ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {/* Hexagon shape using clip-path */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: isActive ? color : '#2a2d35',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              border: isActive ? `3px solid ${color}` : '2px solid #3a3d45',
              boxShadow: isActive ? `0 0 20px ${color}40` : '0 4px 8px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* File extension label */}
            <div
              style={{
                color: isActive ? '#000' : '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '0 8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '90%',
              }}
            >
              {doc.title.split('.').pop().toUpperCase()}
            </div>
          </div>
          
          {/* Close button */}
          {documents.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHexClose(doc.id);
              }}
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#ff4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                display: hoveredId === doc.id ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              ×
            </button>
          )}
        </div>
        
        {/* Filename tooltip */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 8,
            padding: '4px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3d45',
            borderRadius: 4,
            fontSize: 11,
            color: '#ccc',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: hoveredId === doc.id ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          {doc.title}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="hex-drag-area"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#0E0F13',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          fontSize: 10,
          color: '#666',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        Drag to pan • Scroll to zoom
      </div>

      {/* File count */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 11,
          color: '#888',
          backgroundColor: '#1a1d27',
          padding: '4px 8px',
          borderRadius: 4,
          border: '1px solid #2a2f3d',
          pointerEvents: 'none',
        }}
      >
        {documents.length} file{documents.length !== 1 ? 's' : ''}
      </div>

      {/* Hexagons */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease',
        }}
      >
        {documents.map((doc, index) => (
          <Hexagon
            key={doc.id}
            doc={doc}
            position={getHexPosition(index, documents.length)}
            isActive={doc.id === currentDocumentId}
            onHexClick={onSelect}
            onHexClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
