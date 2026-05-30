import React, { useState } from 'react';
import { Briefcase, Users, History, HelpCircle, Shield, Award, Globe } from 'lucide-react';
import type { Faction, LoreEvent, Item, Quest } from '../engine/worldGenerator';
import type { ExploredWorld } from '../engine/secretEngine';

interface CodexProps {
  inventory: Item[];
  factions: Faction[];
  loreTimeline: LoreEvent[];
  activeQuests: Quest[];
  playerName: string;
  playerTitle: string;
  exploredWorlds: ExploredWorld[];
  onReWeave?: (world: ExploredWorld) => void;
  magicRatio?: number;
  techRatio?: number;
  dangerLevel?: number;
  collectedFragmentsCount?: number;
  credits?: number;
}

export const Codex: React.FC<CodexProps> = ({
  inventory,
  factions,
  loreTimeline,
  activeQuests,
  playerName,
  playerTitle,
  exploredWorlds,
  onReWeave,
  magicRatio = 50,
  techRatio = 50,
  dangerLevel = 3,
  collectedFragmentsCount = 0,
  credits = 100
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'factions' | 'chronicles' | 'archives'>('inventory');
  const [showStats, setShowStats] = useState(false);

  // Dynamic Character RPG Stats calculations
  const aetherResonance = Math.min(150, magicRatio + (collectedFragmentsCount * 5));
  const technoCognition = Math.min(150, techRatio + (inventory.length * 4));
  
  const totalNodesExplored = exploredWorlds.reduce((acc, w) => acc + w.nodesVisited, 0);
  const completedQuestsCount = activeQuests.filter(q => q.completed).length;
  
  const chronosInsight = 10 + (totalNodesExplored * 8) + (completedQuestsCount * 15);
  const dimensionalResolve = 30 + (dangerLevel * 10) + (completedQuestsCount * 10);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '270px', overflow: 'hidden', position: 'relative' }}>
      {/* Player Profile Badge */}
      <div 
        onClick={() => setShowStats(!showStats)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '8px 14px', 
          borderBottom: '1px solid var(--border-light)', 
          background: showStats ? 'rgba(155, 81, 224, 0.08)' : 'rgba(155, 81, 224, 0.03)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Explorer:</span>
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '0.5px' }}>{playerName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-teal)', fontWeight: 500, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              ✧ {playerTitle} ✧
            </span>
            <span style={{ fontSize: '9px', background: 'rgba(255,184,0,0.1)', color: 'var(--color-amber)', border: '1px solid rgba(255,184,0,0.2)', padding: '0px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
              🪙 {credits} Credits
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-teal)', fontSize: '11px', fontWeight: 600 }}>
          <span>{showStats ? '▲ Hide Stats' : '📊 View Stats'}</span>
        </div>
      </div>

      {/* Slide-down Dynamic Character Stats Sheet Overlay */}
      {showStats && (
        <div 
          className="animate-typewriter"
          style={{
            position: 'absolute',
            top: '45px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-light)',
            zIndex: 100,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 'bold', fontFamily: 'var(--font-serif)', letterSpacing: '0.8px' }}>
              📊 EXPLORER CHARACTER ATTRIBUTES
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Seeded dynamically from active timelines</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="glass-card" style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(155, 81, 224, 0.02)', border: '1px solid rgba(155, 81, 224, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span style={{ color: 'var(--color-purple)', fontWeight: 600 }}>✦ Aether Resonance</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{aetherResonance} / 150</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(aetherResonance / 150) * 100}%`, height: '100%', background: 'var(--color-purple)' }} />
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Base Magic: {magicRatio}% | Boost: +{collectedFragmentsCount * 5} from {collectedFragmentsCount} shards
              </span>
            </div>

            <div className="glass-card" style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0, 242, 254, 0.02)', border: '1px solid rgba(0, 242, 254, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>⚙ Techno-Cognition</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{technoCognition} / 150</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(technoCognition / 150) * 100}%`, height: '100%', background: 'var(--color-teal)' }} />
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Base Tech: {techRatio}% | Boost: +{inventory.length * 4} from {inventory.length} reliquaries in pack
              </span>
            </div>

            <div className="glass-card" style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255, 184, 0, 0.02)', border: '1px solid rgba(255, 184, 0, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>⏳ Chronos Insight</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{chronosInsight}</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (chronosInsight / 200) * 100)}%`, height: '100%', background: 'var(--color-amber)' }} />
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Chronicle Level: {totalNodesExplored} worlds nodes explored (+{totalNodesExplored * 8} points) | Quests: +{completedQuestsCount * 15}
              </span>
            </div>

            <div className="glass-card" style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255, 75, 92, 0.02)', border: '1px solid rgba(255, 75, 92, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>🛡 Dimensional Resolve</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{dimensionalResolve}</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (dimensionalResolve / 150) * 100)}%`, height: '100%', background: 'var(--color-crimson)' }} />
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Base Danger Factor: {30 + dangerLevel * 10} (+{dangerLevel * 10} danger adaptation) | Quests: +{completedQuestsCount * 10}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Menu Header */}
      <div 
        style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid var(--border-light)',
          padding: '2px',
          gap: '2px'
        }}
      >
        <button
          onClick={() => setActiveTab('inventory')}
          className="btn-cosmic"
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '10.5px',
            borderRadius: '6px',
            background: activeTab === 'inventory' ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none',
            color: activeTab === 'inventory' ? 'var(--color-teal)' : 'var(--text-secondary)',
            justifyContent: 'center',
            height: 'auto',
            gap: '4px'
          }}
        >
          <Briefcase size={11} />
          <span>Pack ({inventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('factions')}
          className="btn-cosmic"
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '10.5px',
            borderRadius: '6px',
            background: activeTab === 'factions' ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none',
            color: activeTab === 'factions' ? 'var(--color-teal)' : 'var(--text-secondary)',
            justifyContent: 'center',
            height: 'auto',
            gap: '4px'
          }}
        >
          <Users size={11} />
          <span>Factions</span>
        </button>

        <button
          onClick={() => setActiveTab('chronicles')}
          className="btn-cosmic"
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '10.5px',
            borderRadius: '6px',
            background: activeTab === 'chronicles' ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none',
            color: activeTab === 'chronicles' ? 'var(--color-teal)' : 'var(--text-secondary)',
            justifyContent: 'center',
            height: 'auto',
            gap: '4px'
          }}
        >
          <History size={11} />
          <span>Chronicles</span>
        </button>

        <button
          onClick={() => setActiveTab('archives')}
          className="btn-cosmic"
          style={{
            flex: 1,
            padding: '6px 4px',
            fontSize: '10.5px',
            borderRadius: '6px',
            background: activeTab === 'archives' ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none',
            color: activeTab === 'archives' ? 'var(--color-teal)' : 'var(--text-secondary)',
            justifyContent: 'center',
            height: 'auto',
            gap: '4px'
          }}
        >
          <Globe size={11} />
          <span>Archives ({exploredWorlds.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', background: 'rgba(5, 5, 8, 0.4)' }}>
        
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {inventory.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px', gap: '4px' }}>
                <HelpCircle size={20} />
                <span>Your pack is empty. Search ruins and talk to citizens to discover items.</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                {inventory.map(item => (
                  <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{item.name}</span>
                      <span style={{ fontSize: '9px', background: 'rgba(255, 184, 0, 0.1)', color: 'var(--color-amber)', border: '1px solid rgba(255,184,0,0.2)', padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>
                        {item.type}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.description}</p>
                    {item.usableAtNodeId && (
                      <span style={{ fontSize: '9px', color: 'var(--color-teal)', fontWeight: 500 }}>
                        🔑 Linked gate: Travel to target to deploy.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Active Quests overlay inside inventory page */}
            {activeQuests.length > 0 && (
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                <span className="cosmic-label" style={{ fontSize: '10px' }}>Active Grid Operations</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {activeQuests.map(q => (
                    <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.15)', padding: '6px', borderRadius: '4px', fontSize: '11px' }}>
                      <Award size={12} style={{ color: 'var(--color-success)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'white', fontWeight: 500 }}>{q.title}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{q.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FACTIONS TAB */}
        {activeTab === 'factions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {factions.map(faction => {
              // Reputation bar math
              const pct = faction.standing; // range 0 to 100
              let repLabel = 'Neutral';
              let repColor = 'var(--text-secondary)';
              
              if (pct >= 75) { repLabel = 'Ally'; repColor = 'var(--color-success)'; }
              else if (pct > 55) { repLabel = 'Friendly'; repColor = 'var(--color-teal)'; }
              else if (pct < 35) { repLabel = 'Hostile'; repColor = 'var(--color-crimson)'; }

              return (
                <div key={faction.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={14} style={{ color: repColor }} />
                      <h4 style={{ fontSize: '13px', color: 'white', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{faction.name}</h4>
                    </div>
                    <span style={{ fontSize: '10px', color: repColor, fontWeight: 600 }}>{repLabel} ({pct}/100)</span>
                  </div>
                  
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{faction.description}</p>
                  
                  {/* Standing gauge */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: repColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CHRONICLES TAB */}
        {activeTab === 'chronicles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loreTimeline.map(event => (
              <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: event.isCustom ? '3px solid var(--color-purple)' : '1px solid var(--border-light)', padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-teal)', fontWeight: 600 }}>{event.era}</span>
                  {event.isCustom && (
                    <span style={{ fontSize: '8px', background: 'rgba(155, 81, 224, 0.2)', color: 'var(--color-purple)', border: '1px solid var(--color-purple-glow)', padding: '1px 4px', borderRadius: '3px' }}>
                      CUSTOM CHRONICLE
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '12px', color: 'white', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{event.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{event.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* ARCHIVES TAB */}
        {activeTab === 'archives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exploredWorlds.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px', gap: '4px' }}>
                <Globe size={20} />
                <span>No explored worlds recorded in the galactic archives.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exploredWorlds.map(w => {
                  const pct = Math.round((w.nodesVisited / w.totalNodes) * 100);
                  const isDone = w.nodesVisited === w.totalNodes;
                  
                  return (
                    <div 
                      key={w.seed}
                      className="glass-card" 
                      style={{ 
                        padding: '8px 10px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '11px',
                        borderLeft: isDone ? '2px solid var(--color-success)' : '1px solid var(--border-light)',
                        background: 'rgba(255, 255, 255, 0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, marginRight: '8px' }}>
                        <span style={{ color: 'white', fontWeight: 600 }}>{w.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                          Genre: <span style={{ color: 'var(--color-teal)' }}>{w.genre}</span> | Seed: {w.seed}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                          <span style={{ color: isDone ? 'var(--color-success)' : 'var(--color-amber)', fontWeight: 'bold', fontSize: '10px' }}>
                            {w.nodesVisited}/{w.totalNodes} Nodes ({pct}%)
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {isDone ? 'Completed' : 'Exploring'}
                          </span>
                        </div>
                        {onReWeave && (
                          <button
                            onClick={() => onReWeave(w)}
                            className="btn-cosmic btn-outline"
                            style={{
                              padding: '4px 8px',
                              fontSize: '9px',
                              height: 'auto',
                              borderRadius: '4px',
                              border: '1px solid var(--border-glow)'
                            }}
                            title="Re-weave Spindle into this timeline"
                          >
                            🌌 Spin
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
