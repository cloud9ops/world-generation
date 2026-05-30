import React, { useEffect, useRef, useState } from 'react';
import { Terminal, HelpCircle, Send } from 'lucide-react';
import type { WorldNode, NPC } from '../engine/worldGenerator';

export interface ChronicleLog {
  id: string;
  text: string;
  timestamp: string;
  type: 'travel' | 'search' | 'quest' | 'dialogue' | 'secret' | 'system' | 'error';
}

interface ChronicleTerminalProps {
  logs: ChronicleLog[];
  activeNode: WorldNode;
  activeNPC: NPC | null;
  onExecuteCommand: (cmd: string) => void;
  isCustomActionPending: boolean;
  activePatrol?: { factionId: string; toll: number; nodeId: string; factionName: string } | null;
  stats?: {
    aetherResonance: number;
    technoCognition: number;
    chronosInsight: number;
    dimensionalResolve: number;
  } | null;
  credits?: number;
  characterProfile?: {
    className: string;
    sideStory: string;
    baseHealth: number;
    baseStrength: number;
    baseAgility: number;
    baseIntellect: number;
  } | null;
}

export const ChronicleTerminal: React.FC<ChronicleTerminalProps> = ({
  logs,
  activeNode,
  activeNPC,
  onExecuteCommand,
  isCustomActionPending,
  activePatrol = null,
  stats = null,
  credits = 100,
  characterProfile = null
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [showHelper, setShowHelper] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal whenever logs change
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeNPC, isCustomActionPending]);

  // Helper to parse logs and replace specific phrases with custom highlighted tooltips
  const formatLogText = (text: string, type: string) => {
    if (type === 'error') {
      return (
        <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>
          ⚠️ {text}
        </span>
      );
    }

    const secretKeyword = "A Fragment of the Hidden World has been discovered.";
    if (text.includes(secretKeyword)) {
      return (
        <span style={{ color: 'var(--color-purple)', fontWeight: 'bold', textShadow: '0 0 10px var(--color-purple-glow)' }}>
          ✨ {text}
        </span>
      );
    }

    return <span>{text}</span>;
  };

  const merchantNPC = activeNode.npcs.find(n => n.isMerchant);

  return (
    <div className="glass-panel glass-panel-glow-purple right-column" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <Terminal className="animate-pulse-glow" style={{ color: 'var(--color-purple)' }} size={18} />
        <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Chronicle Terminal</h2>
      </div>

      {/* Dynamic RPG Character Attributes Tracker (Clickable Trigger) */}
      {stats && (
        <div 
          onClick={() => setShowStatsModal(true)}
          className="glass-card animate-typewriter" 
          title="Click to view detailed Attributes definitions, health, and side story!"
          style={{ 
            padding: '8px 12px', 
            background: 'rgba(15, 12, 30, 0.4)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(155, 81, 224, 0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 12, 30, 0.4)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--color-purple)', fontWeight: 'bold' }}>🔮 AR:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.aetherResonance}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>⚙️ TC:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.technoCognition}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>⏳ CI:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.chronosInsight}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>🛡️ DR:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.dimensionalResolve}</span>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)', 
              paddingLeft: '8px' 
            }}
          >
            <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>🪙:</span>
            <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>{credits}</span>
          </div>
        </div>
      )}

      {/* Dynamic RPG Character Attributes Popover Modal */}
      {showStatsModal && stats && (
        <div 
          className="glass-panel animate-typewriter" 
          style={{ 
            position: 'absolute',
            top: '55px',
            left: '16px',
            right: '16px',
            bottom: '16px',
            background: 'rgba(10, 8, 16, 0.95)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            border: '1px solid rgba(155, 81, 224, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto'
          }}
        >
          {/* Modal Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-purple)', fontWeight: 'bold', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>
              🌌 EXPLORER BIO & COGNITIVE DATA
            </span>
            <button 
              onClick={() => setShowStatsModal(false)}
              className="btn-cosmic btn-outline"
              style={{ padding: '2px 8px', fontSize: '9px', height: 'auto', borderRadius: '4px' }}
            >
              Close [X]
            </button>
          </div>

          {/* Profile details */}
          {characterProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '8px 10px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Alignment Class:</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>{characterProfile.className}</span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                "{characterProfile.sideStory}"
              </p>
            </div>
          )}

          {/* RPG Core Survival Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              ❤️ Survival Parameters:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '6px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Health (VIT):</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{characterProfile ? characterProfile.baseHealth : 100} / 100</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '6px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Strength (STR):</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {characterProfile ? characterProfile.baseStrength + Math.round(stats.dimensionalResolve / 10) : 10 + Math.round(stats.dimensionalResolve / 10)}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '6px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agility (AGI):</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {characterProfile ? characterProfile.baseAgility + Math.round(stats.chronosInsight / 12) : 10 + Math.round(stats.chronosInsight / 12)}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '6px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Intellect (INT):</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {characterProfile ? characterProfile.baseIntellect + Math.round(stats.aetherResonance / 8) : 10 + Math.round(stats.aetherResonance / 8)}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Attributes Meanings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              📊 Attributes Ledger:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <div>
                <span style={{ color: 'var(--color-purple)', fontWeight: 'bold' }}>🔮 Aether Resonance ({stats.aetherResonance})</span>: Measures cosmic magical affinity. Derived from genre presets and collected shards. Boosts magical capability and intellect.
              </div>
              <div>
                <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>⚙️ Techno-Cognition ({stats.technoCognition})</span>: Measures cybernetic grid processing index. Derived from genre tech ratios and items in pack.
              </div>
              <div>
                <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>⏳ Chronos Insight ({stats.chronosInsight})</span>: Reflects timeline coordinate alignment level. Boosts evasion and spatial agility parameter.
              </div>
              <div>
                <span style={{ color: 'var(--color-crimson)', fontWeight: 'bold' }}>🛡️ Dimensional Resolve ({stats.dimensionalResolve})</span>: Represents survival adaptivity. Boosts physical combat strength.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hostile Faction Patrol Blockade Intercept Alert */}
      {activePatrol && (
        <div 
          className="glass-card animate-flash-red animate-typewriter" 
          style={{ 
            padding: '8px 12px', 
            background: 'rgba(220, 38, 38, 0.05)', 
            border: '1px solid var(--color-crimson)', 
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            lineHeight: '1.4'
          }}
        >
          <span style={{ fontWeight: 'bold', color: 'var(--color-crimson)' }}>🚨 INTERCEPTION DETECTED:</span> Hostile **{activePatrol.factionName}** patrols have locked warp coordinates! You cannot warp or search landmarks until you resolve this blockade.
          <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
            Commands: Type <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>combat</span>, <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>evade</span>, or <span style={{ color: 'var(--color-teal)', fontWeight: 'bold' }}>bribe [Credits amount]</span> (Toll: {activePatrol.toll} Credits).
          </div>
        </div>
      )}

      {/* Active Environmental Hazard Alert */}
      {activeNode.hazard && !activeNode.hazardResolved && (
        <div 
          className="glass-card animate-typewriter" 
          style={{ 
            padding: '8px 12px', 
            background: 'rgba(217, 119, 6, 0.03)', 
            border: '1px dashed var(--color-amber)', 
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--text-primary)'
          }}
        >
          <span style={{ fontWeight: 'bold', color: 'var(--color-amber)' }}>⚠️ SECTOR ENVIRONMENTAL HAZARD:</span> '{activeNode.hazard}' is active! Threat double! Use appropriate protecting filters to stabilize the sector.
        </div>
      )}

      {/* Narrative Scroll Logs */}
      <div 
        className="terminal-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'rgba(5, 5, 8, 0.7)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          lineHeight: '1.5'
        }}
      >
        {logs.map((log) => {
          let typeColor = 'var(--text-secondary)';
          if (log.type === 'travel') typeColor = 'var(--color-teal)';
          if (log.type === 'search') typeColor = 'var(--color-amber)';
          if (log.type === 'quest') typeColor = 'var(--color-success)';
          if (log.type === 'dialogue') typeColor = 'var(--text-primary)';
          if (log.type === 'secret') typeColor = 'var(--color-purple)';
          if (log.type === 'error') typeColor = 'var(--color-crimson)';
          
          return (
            <div 
              key={log.id} 
              className="animate-typewriter"
              style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.02)', 
                paddingBottom: '8px',
                color: typeColor
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                <span>[{log.type.toUpperCase()}]</span>
                <span>{log.timestamp}</span>
              </div>
              {formatLogText(log.text, log.type)}
            </div>
          );
        })}
        {isCustomActionPending && (
          <div style={{ color: 'var(--color-purple)', animation: 'pulseGlow 1.5s infinite ease-in-out', fontSize: '12px' }}>
            ⏳ Calibrating timeline channels...
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Text Command Terminal Input */}
      <div 
        style={{
          padding: '12px',
          background: 'rgba(5, 5, 8, 0.9)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: activeNPC ? 'var(--color-purple)' : 'var(--color-teal)', fontWeight: 'bold', textTransform: 'uppercase' }}>
            🛰 Mode: {activePatrol ? `Hostile Blockade` : activeNPC ? `Dialogue with ${activeNPC.name.split(' ')[0]}` : `Navigation — Sector ${activeNode.name.split(' #')[0]}`}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Type 'help' for manual</span>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (commandInput.trim()) {
              onExecuteCommand(commandInput.trim());
              setCommandInput('');
            }
          }}
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <span style={{ color: activeNPC ? 'var(--color-purple)' : 'var(--color-teal)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '14px' }}>&gt;</span>
          <input
            type="text"
            placeholder={activePatrol ? "Type combat, evade, or bribe [Credits]..." : activeNPC ? "Type response (e.g. 'ask history', 'goodbye', 'buy [item]')..." : "Type action (e.g. 'go [sector name]', 'search [landmark]')..."}
            className="cosmic-input mono-text"
            style={{ flex: 1, background: 'rgba(10, 10, 15, 0.8)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', height: '36px' }}
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isCustomActionPending}
            autoFocus
          />
          <button type="submit" className="btn-cosmic btn-outline" style={{ padding: '0 12px', height: '36px' }} disabled={isCustomActionPending}>
            <Send size={12} />
          </button>
        </form>

        {/* Collapsible Local Dossier Commands Helper */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
          <button
            onClick={() => setShowHelper(!showHelper)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
          >
            <HelpCircle size={10} style={{ color: 'var(--color-teal)' }} />
            <span>{showHelper ? 'Hide Command Dossier' : 'Show Command Dossier'}</span>
          </button>
          {showHelper && (
            <div className="animate-typewriter" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {activePatrol ? (
                <>
                  <div><span style={{ color: 'var(--text-muted)' }}>Blockade Bypass:</span> <span style={{ color: 'var(--color-crimson)' }}>combat</span> (roll resolve fight) | <span style={{ color: 'var(--color-amber)' }}>evade</span> (evasion roll) | <span style={{ color: 'var(--color-success)' }}>bribe [amount]</span> (pay toll)</div>
                </>
              ) : !activeNPC ? (
                <>
                  <div><span style={{ color: 'var(--text-muted)' }}>Warp Corridors:</span> <span style={{ color: 'var(--color-teal)' }}>go [Sector]</span> or <span style={{ color: 'var(--color-teal)' }}>travel to [Sector]</span></div>
                  {activeNode.landmarks.filter(l => !l.searched).length > 0 && (
                    <div><span style={{ color: 'var(--text-muted)' }}>Landmarks:</span> {activeNode.landmarks.filter(l => !l.searched).map(l => (
                      <span key={l.id} style={{ color: 'var(--color-amber)', marginRight: '6px' }}>search {l.name.split("'s ")[1] || l.name}</span>
                    ))}</div>
                  )}
                  {activeNode.npcs.length > 0 && (
                    <div><span style={{ color: 'var(--text-muted)' }}>Citizens:</span> {activeNode.npcs.map(npc => (
                      <span key={npc.id} style={{ color: npc.isMerchant ? 'var(--color-amber)' : 'var(--color-teal)', marginRight: '6px' }}>talk {npc.name.split(' ')[0]} {npc.isMerchant ? '🪙' : ''}</span>
                    ))}</div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Dialogue Actions:</span> 
                    <span style={{ color: 'var(--color-purple)', marginRight: '6px' }}>ask history</span> 
                    {activeNPC.quest && !activeNPC.quest.completed && <span style={{ color: 'var(--color-success)', marginRight: '6px' }}>complete quest</span>}
                    {merchantNPC && (
                      <>
                        <span style={{ color: 'var(--color-amber)', marginRight: '6px' }}>buy [item]</span>
                        <span style={{ color: 'var(--color-amber)', marginRight: '6px' }}>sell [item]</span>
                      </>
                    )}
                    <span style={{ color: 'var(--color-crimson)' }}>goodbye</span>
                  </div>
                  {merchantNPC && merchantNPC.inventoryForSale && merchantNPC.inventoryForSale.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', padding: '4px', borderRadius: '4px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>🛒 Merchant Catalogue:</span>
                      {merchantNPC.inventoryForSale.map(item => (
                        <div key={item.id} style={{ fontSize: '9px', marginLeft: '6px', color: 'var(--text-secondary)' }}>
                          - <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.name}</span> ({item.type.toUpperCase()}) — <span style={{ color: 'var(--color-amber)' }}>{merchantNPC.buyPrices?.[item.id] || 30} Credits</span>: {item.description}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
