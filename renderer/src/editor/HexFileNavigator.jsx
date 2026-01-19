import { useState, useEffect, useRef } from "react";
import { getFileColor } from "../core/fileExtensions";
import { analyzeFileDependencies, getDependencyStrength, getDependencyColor } from "../core/dependencyAnalyzer";

// Hexagonal file navigator inspired by Apple Watch with dependency visualization
export default function HexFileNavigator({ documents, currentDocumentId, onSelect, onClose, onRename }) {
  const dependencies = analyzeFileDependencies(documents);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);

  // Calculate hexagon positions in a honeycomb pattern
  const getHexPosition = (index, total) => {
    const hexSize = 70;
    const hexSpacing = 90;
    
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
    if (e.button !== 0) return; // Only left mouse button
    
    // Don't start dragging if clicking on a hexagon or button
    if (e.target.closest('[data-hex-item]')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleWheel = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMoveDocument = (e) => {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleMouseUpDocument = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMoveDocument);
    document.addEventListener('mouseup', handleMouseUpDocument);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDocument);
      document.removeEventListener('mouseup', handleMouseUpDocument);
    };
  }, [isDragging, dragStart]);

  // Draw connection line between two hexagons
  const ConnectionLine = ({ from, to, strength }) => {
    const fromPos = getHexPosition(from.index, documents.length);
    const toPos = getHexPosition(to.index, documents.length);
    
    const color = getDependencyColor(strength);
    const width = strength === 3 ? 2 : 1;
    
    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <line
          x1={`calc(50% + ${fromPos.x}px)`}
          y1={`calc(50% + ${fromPos.y}px)`}
          x2={`calc(50% + ${toPos.x}px)`}
          y2={`calc(50% + ${toPos.y}px)`}
          stroke={color}
          strokeWidth={width}
          strokeDasharray={strength === 1 ? "5,5" : "none"}
          opacity={0.6}
        />
      </svg>
    );
  };

  // Hexagon component
  const Hexagon = ({ doc, position, isActive, onHexClick, onHexClose }) => {
    const color = getFileColor(doc.title);
    const size = 65;
    
    return (
      <div
        data-hex-item
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
            transform: hoveredId === doc.id ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          {/* Hexagon shape using clip-path */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: isActive ? color : '#f1ebef',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              border: isActive ? `3px solid ${color}` : '1px solid #e2d8e0',
              boxShadow: isActive ? `0 4px 12px ${color}30` : '0 2px 4px rgba(46, 42, 47, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '4px',
            }}
          >
            {/* File name - always visible */}
            <div
              style={{
                color: isActive ? '#fff' : '#2e2a2f',
                fontSize: '9px',
                fontWeight: 'bold',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '90%',
                marginBottom: '2px',
              }}
            >
              {doc.title.length > 12 ? doc.title.substring(0, 10) + '..' : doc.title}
            </div>
            
            {/* File extension badge */}
            <div
              style={{
                color: isActive ? '#fff' : color,
                fontSize: '8px',
                fontWeight: '600',
                textAlign: 'center',
                backgroundColor: isActive ? color : 'transparent',
                padding: '2px 4px',
                borderRadius: '3px',
              }}
            >
              .{doc.title.split('.').pop()}
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
                backgroundColor: '#d6a0a0',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                display: hoveredId === doc.id ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 120ms ease-out',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c68a8a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#d6a0a0'}
            >
              ×
            </button>
          )}
        </div>
        
        {/* Dependency indicator */}
        {dependencies[doc.id] && (dependencies[doc.id].imports.length > 0 || dependencies[doc.id].importedBy.length > 0) && (
          <div
            style={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 8,
              color: '#c89fb6',
              backgroundColor: '#fbf8fa',
              padding: '2px 4px',
              borderRadius: 4,
              border: '1px solid #c89fb6',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              fontWeight: 600,
            }}
          >
            {dependencies[doc.id].imports.length > 0 && `→${dependencies[doc.id].imports.length}`}
            {dependencies[doc.id].imports.length > 0 && dependencies[doc.id].importedBy.length > 0 && ' '}
            {dependencies[doc.id].importedBy.length > 0 && `←${dependencies[doc.id].importedBy.length}`}
          </div>
        )}
        
        {/* Full filename tooltip on hover */}
        {doc.title.length > 12 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 12,
              padding: '6px 10px',
              backgroundColor: '#f6f2f4',
              border: '1px solid #e2d8e0',
              borderRadius: 6,
              fontSize: 11,
              color: '#2e2a2f',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              opacity: hoveredId === doc.id ? 1 : 0,
              transition: 'opacity 120ms ease-out',
              zIndex: 100,
            }}
          >
            {doc.title}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#fbf8fa',
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
          fontSize: 11,
          color: '#8c8791',
          pointerEvents: 'none',
          zIndex: 100,
          backgroundColor: '#f6f2f4',
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #e2d8e0',
        }}
      >
        <div>🖱️ Drag to pan • 🔍 Scroll to zoom</div>
        <div style={{ fontSize: 10, color: '#b8a0b6', marginTop: 3 }}>
          <span style={{ color: '#c89fb6' }}>━━</span> Direct import • 
          <span style={{ color: '#d0c5d6' }}> ┄┄</span> Reference
        </div>
      </div>

      {/* File count */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: 12,
          color: '#8c8791',
          backgroundColor: '#f6f2f4',
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid #e2d8e0',
          pointerEvents: 'none',
        }}
      >
        {documents.length} file{documents.length !== 1 ? 's' : ''}
      </div>

      {/* Hexagons and connections */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease',
        }}
      >
        {/* Draw connection lines first (behind hexagons) */}
        {documents.map((fromDoc, fromIndex) => {
          return documents.map((toDoc, toIndex) => {
            if (fromDoc.id === toDoc.id) return null;
            
            const strength = getDependencyStrength(fromDoc, toDoc, dependencies);
            if (strength === 0) return null;
            
            return (
              <ConnectionLine
                key={`${fromDoc.id}-${toDoc.id}`}
                from={{ ...fromDoc, index: fromIndex }}
                to={{ ...toDoc, index: toIndex }}
                strength={strength}
              />
            );
          });
        })}
        
        {/* Draw hexagons on top */}
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
