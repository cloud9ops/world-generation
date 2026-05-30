import React, { useState } from 'react';
import { Compass, MapPin, Skull, Users, ShoppingBag } from 'lucide-react';
import type { WorldNode } from '../engine/worldGenerator';

interface ConstellationMapProps {
  nodes: WorldNode[];
  activeNodeId: string;
  onNodeClick: (nodeId: string) => void;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({ nodes, activeNodeId, onNodeClick }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // SVG dimensions for the viewport
  const viewWidth = 800;
  const viewHeight = 600;

  // Find active node coordinates for drawing player coordinates/indicators
  const activeNode = nodes.find(n => n.id === activeNodeId);

  // Helper to extract node connections for unique lines
  const connectionLines: { from: WorldNode; to: WorldNode; key: string }[] = [];
  const processedKeys = new Set<string>();

  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const targetNode = nodes.find(n => n.id === connId);
      if (targetNode) {
        // Create unique sorted key to prevent drawing lines twice
        const key = [node.id, connId].sort().join('-');
        if (!processedKeys.has(key)) {
          processedKeys.add(key);
          connectionLines.push({ from: node, to: targetNode, key });
        }
      }
    });
  });

  return (
    <div className="glass-panel center-column" style={{ flex: 1, padding: '16px', position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
      {/* Header Overlay */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className="animate-pulse-glow" style={{ color: 'var(--color-teal)' }} size={18} />
          <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Aetherial Map</h2>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {nodes.filter(n => n.status !== 'unexplored').length} / {nodes.length} Discovered
        </span>
      </div>

      {/* Constellation SVG Viewer */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg 
          viewBox={`0 0 ${viewWidth} ${viewHeight}`} 
          className="constellation-svg"
          style={{ width: '100%', height: '100%', maxHeight: '520px' }}
        >
          {/* Subtle background grid pattern */}
          <defs>
            <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(155, 81, 224, 0.15)" />
              <stop offset="50%" stopColor="rgba(0, 242, 254, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="glow-teal">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Nebula core background */}
          <circle cx={viewWidth / 2} cy={viewHeight / 2} r="350" fill="url(#nebula)" pointerEvents="none" />

          {/* Dotted Coordinate Rings */}
          <circle cx={viewWidth / 2} cy={viewHeight / 2} r="250" fill="none" stroke="var(--svg-ring-stroke, rgba(255,255,255,0.03))" strokeWidth="1" strokeDasharray="3 6" pointerEvents="none" />
          <circle cx={viewWidth / 2} cy={viewHeight / 2} r="150" fill="none" stroke="var(--svg-ring-stroke, rgba(255,255,255,0.02))" strokeWidth="1" strokeDasharray="3 6" pointerEvents="none" />

          {/* Connection Lines */}
          {connectionLines.map(line => {
            const isActivePath = line.from.id === activeNodeId || line.to.id === activeNodeId;
            const isUnexplored = line.from.status === 'unexplored' && line.to.status === 'unexplored';
            
            return (
              <line
                key={line.key}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke={isUnexplored ? 'var(--svg-path-unexplored, rgba(255,255,255,0.02))' : isActivePath ? 'var(--svg-path-active, rgba(0, 242, 254, 0.35))' : 'var(--svg-path-explored, rgba(255,255,255,0.08))'}
                strokeWidth={isActivePath ? '2.5' : '1.2'}
                className={isUnexplored ? 'path-line' : 'path-line-pulsing'}
                filter={isActivePath ? 'url(#glow-teal)' : undefined}
              />
            );
          })}

          {/* Nodes Rendering */}
          {nodes.map(node => {
            const isActive = node.id === activeNodeId;
            const isVisited = node.status === 'visited';
            const isUnexplored = node.status === 'unexplored';
            
            // Choose color representation
            let fill = 'var(--text-muted)';
            let stroke = 'rgba(255, 255, 255, 0.15)';
            let filter = undefined;

            if (isActive) {
              fill = 'var(--color-teal)';
              stroke = 'var(--svg-node-active-stroke, #ffffff)';
              filter = 'url(#glow-teal)';
            } else if (isVisited) {
              fill = 'var(--bg-panel-solid, #ffffff)';
              stroke = 'var(--color-teal-glow)';
              filter = 'url(#glow-teal)';
            } else if (isUnexplored) {
              fill = 'var(--svg-node-unexplored-fill, #1a1d24)';
              stroke = 'var(--svg-node-unexplored-stroke, rgba(255,255,255,0.05))';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="node-group"
                onClick={() => onNodeClick(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Outer pulsing ring for active node */}
                {isActive && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="var(--color-teal)"
                    strokeWidth="1.5"
                    style={{
                      transformOrigin: 'center',
                      animation: 'pulseGlow 2s infinite ease-in-out'
                    }}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={isActive ? '14' : isVisited ? '10' : '8'}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="node-circle"
                  filter={filter}
                />

                {/* Inner dot or star for visited nodes */}
                {isVisited && !isActive && (
                  <circle r="4" fill="var(--color-teal)" />
                )}

                {/* Node Title Labels */}
                {!isUnexplored && (
                  <text
                    y={isActive ? '30' : '22'}
                    textAnchor="middle"
                    className="node-text"
                    style={{
                      fill: isActive ? 'white' : 'var(--text-secondary)',
                      fontWeight: isActive ? '600' : '400',
                      textShadow: isActive ? '0 0 10px rgba(0, 242, 254, 0.4)' : 'none'
                    }}
                  >
                    {node.name.split(' #')[0]}
                  </text>
                )}

                {/* Unexplored Question Mark tag */}
                {isUnexplored && (
                  <text
                    y="3"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.2)"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    ?
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic HTML Tooltip Overlay overlaying the SVG */}
        {hoveredNodeId && (
          (() => {
            const node = nodes.find(n => n.id === hoveredNodeId);
            if (!node) return null;

            const isUnexplored = node.status === 'unexplored';
            const isConnected = activeNode?.connections.includes(node.id);

            return (
              <div 
                className="glass-card animate-typewriter"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px',
                  background: 'var(--bg-panel)',
                  border: isUnexplored ? '1px solid var(--border-light)' : '1px solid var(--color-teal)',
                  boxShadow: isUnexplored ? 'none' : 'var(--shadow-glow)',
                  pointerEvents: 'none',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {isUnexplored ? 'Coordinate Sector (Undiscovered)' : node.biome}
                  </span>
                  {!isUnexplored && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-crimson)', fontSize: '11px' }}>
                      <Skull size={10} />
                      <span>Danger {node.danger}</span>
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                  {isUnexplored ? 'Coordinate Grid' : node.name}
                </h3>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {isUnexplored 
                    ? 'This coordinate sector has not been scanned. Connect to a neighboring region and travel here to survey the biome.'
                    : node.description
                  }
                </p>

                {!isUnexplored && (
                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} style={{ color: 'var(--color-purple)' }} />
                      <span>{node.npcs.length} Figures</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShoppingBag size={12} style={{ color: 'var(--color-amber)' }} />
                      <span>{node.items.length + node.landmarks.filter(l => !l.searched).length} Discoveries</span>
                    </div>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '6px', fontSize: '11px', textAlign: 'center', fontWeight: 600 }}>
                  {node.id === activeNodeId ? (
                    <span style={{ color: 'var(--color-teal)' }}>📍 CURRENT LOCATION</span>
                  ) : isConnected ? (
                    <span style={{ color: 'var(--color-success)' }}>⚡ CLICK NODE TO TRAVEL HERE</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>❌ PATH NOT CONNECTED</span>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Navigation overlay controls */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          background: 'var(--bg-card)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}
      >
        <MapPin size={10} style={{ color: 'var(--color-teal)' }} />
        <span>Select neighboring stars to forge warp pathways.</span>
      </div>
    </div>
  );
};
