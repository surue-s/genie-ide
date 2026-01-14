import React, { useState } from 'react';

export default function TreeView({ document }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  if (!document || !document.ast || !document.ast.rootNode) {
    return (
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        color: '#d4d4d4', 
        padding: '10px', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        No AST available - waiting for document to parse...
      </div>
    );
  }

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node, depth = 0) => {
    const nodeId = `${node.type}-${node.startIndex}`;
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={nodeId} style={{ marginLeft: `${depth * 20}px` }}>
        <div 
          style={{ 
            cursor: hasChildren ? 'pointer' : 'default',
            padding: '2px 4px',
            backgroundColor: hasChildren ? '#2d2d2d' : 'transparent',
            borderRadius: '2px',
            margin: '1px 0'
          }}
          onClick={() => hasChildren && toggleNode(nodeId)}
        >
          {hasChildren && (
            <span style={{ marginRight: '5px', color: '#569cd6' }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span style={{ color: '#569cd6', fontWeight: 'bold' }}>{node.type}</span>
          <span style={{ color: '#6a9955', fontSize: '0.8em', marginLeft: '8px' }}>
            [{node.startPosition.row}:{node.startPosition.column} - {node.endPosition.row}:{node.endPosition.column}]
          </span>
        </div>
        {isExpanded && hasChildren && (
          <div style={{ borderLeft: '1px solid #444', paddingLeft: '5px' }}>
            {node.children.map((child, idx) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#1e1e1e', 
      color: '#d4d4d4', 
      padding: '10px', 
      overflow: 'auto',
      height: '100%',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#9cdcfe' }}>Abstract Syntax Tree (AST)</h3>
      {document.ast.rootNode && renderTreeNode(document.ast.rootNode)}
    </div>
  );
}