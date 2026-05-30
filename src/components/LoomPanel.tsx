import React, { useState } from 'react';
import { Sparkles, Users, Scroll, Settings, Eye, EyeOff } from 'lucide-react';
import type { GenreType, WorldConfig, CustomCharConfig } from '../engine/worldGenerator';

interface LoomPanelProps {
  onForge: (config: WorldConfig, apiKey: string) => void;
  isForging: boolean;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  showCollapse?: boolean;
  onCollapse?: () => void;
}

export const LoomPanel: React.FC<LoomPanelProps> = ({ 
  onForge, 
  isForging,
  playerName,
  onPlayerNameChange,
  showCollapse = false,
  onCollapse
}) => {
  // Config state
  const [prompt, setPrompt] = useState('Floating copper sanctuaries floating in toxic neon clouds');
  const [genre, setGenre] = useState<GenreType>('cyberpunk');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [worldSize, setWorldSize] = useState<number>(8);
  const [dangerLevel, setDangerLevel] = useState<number>(3);
  const [techRatio, setTechRatio] = useState<number>(80);
  const [magicRatio, setMagicRatio] = useState<number>(20);
  const [customLore, setCustomLore] = useState('');
  
  // Custom characters state
  const [chars, setChars] = useState<CustomCharConfig[]>([
    { name: 'Sentinel Kael', role: 'Cyber-Templar Vanguard', startingNodeName: 'Neon Skyline', factionName: 'Megacorp' }
  ]);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('');
  const [newCharNode, setNewCharNode] = useState('');
  const [newCharFaction, setNewCharFaction] = useState('');

  // UI state toggles
  const [showLoreConfig, setShowLoreConfig] = useState(false);
  const [showCharConfig, setShowCharConfig] = useState(false);
  
  // Gemini API Key state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cosmogony_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);

  const handleAddChar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim() || !newCharRole.trim()) return;

    setChars([
      ...chars,
      {
        name: newCharName.trim(),
        role: newCharRole.trim(),
        startingNodeName: newCharNode.trim() || 'Core',
        factionName: newCharFaction.trim() || 'Neutral'
      }
    ]);

    setNewCharName('');
    setNewCharRole('');
    setNewCharNode('');
    setNewCharFaction('');
  };

  const handleRemoveChar = (idx: number) => {
    setChars(chars.filter((_, i) => i !== idx));
  };

  const handleForgeClick = () => {
    // Store API key safely in localStorage
    localStorage.setItem('cosmogony_gemini_key', apiKey);
    
    onForge({
      prompt,
      genre,
      seed: seed || Math.floor(Math.random() * 999999),
      worldSize,
      dangerLevel,
      techRatio,
      magicRatio,
      customLore,
      customCharacters: chars
    }, apiKey);
  };

  return (
    <div className="glass-panel glass-panel-glow-teal left-column" style={{ padding: '16px', gap: '14px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ color: 'var(--color-teal)' }} size={20} className="animate-pulse-glow" />
          <h2 style={{ fontSize: '18px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Cosmic Loom</h2>
        </div>
        {showCollapse && onCollapse && (
          <button 
            onClick={onCollapse}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
            title="Collapse Panel"
          >
            ◀
          </button>
        )}
      </div>

      {/* API Key Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="cosmic-label" style={{ fontSize: '11px', margin: 0 }}>Gemini API Integration</label>
          <span style={{ fontSize: '10px', color: apiKey ? 'var(--color-success)' : 'var(--text-muted)' }}>
            {apiKey ? '● Hybrid Mode Active' : '○ Local Procedural Only'}
          </span>
        </div>
        <div style={{ position: 'relative', display: 'flex', marginTop: '6px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="Paste Gemini API Key..."
            className="cosmic-input"
            style={{ width: '100%', paddingRight: '32px', fontSize: '11px' }}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            type="button"
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Player Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <label className="cosmic-label">Explorer Designation (Your Name)</label>
        <input
          type="text"
          className="cosmic-input"
          placeholder="E.g. Captain Ahab"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
        />
      </div>

      {/* World Prompt */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="cosmic-label">Prompt Concept</label>
        <textarea
          rows={3}
          placeholder="E.g. A city built on the shell of a giant wandering mechanical tortoise..."
          className="cosmic-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ resize: 'none' }}
        />
      </div>

      {/* Genre Selector */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="cosmic-label">Universe Genre</label>
        <select className="cosmic-select" value={genre} onChange={(e) => setGenre(e.target.value as GenreType)}>
          <option value="fantasy">🌌 High Fantasy (Arcane Spire)</option>
          <option value="cyberpunk">⚡ Cyberpunk (Neon Slums)</option>
          <option value="solarpunk">🌱 Solarpunk (Wind Domes)</option>
          <option value="cosmic">🐙 Cosmic Horror (Blind Stars)</option>
          <option value="apocalyptic">💀 Post-Apocalyptic (Scrap Dunes)</option>
        </select>
      </div>

      {/* Seed Config */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="cosmic-label">Spindle Seed</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            className="cosmic-input"
            style={{ flex: 1 }}
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
          />
          <button
            className="btn-cosmic btn-outline"
            style={{ padding: '0 12px' }}
            onClick={() => setSeed(Math.floor(Math.random() * 999999))}
          >
            🎲
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span className="cosmic-label" style={{ margin: 0 }}>Map Nodes</span>
            <span style={{ fontSize: '11px', color: 'var(--color-teal)' }}>{worldSize} locations</span>
          </div>
          <input type="range" min="6" max="12" className="cosmic-slider" value={worldSize} onChange={(e) => setWorldSize(parseInt(e.target.value))} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span className="cosmic-label" style={{ margin: 0 }}>Danger / Hostility</span>
            <span style={{ fontSize: '11px', color: 'var(--color-crimson)' }}>Level {dangerLevel}/5</span>
          </div>
          <input type="range" min="1" max="5" className="cosmic-slider" value={dangerLevel} onChange={(e) => setDangerLevel(parseInt(e.target.value))} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span className="cosmic-label" style={{ margin: 0 }}>Tech</span>
              <span style={{ fontSize: '10px' }}>{techRatio}%</span>
            </div>
            <input type="range" min="0" max="100" className="cosmic-slider" value={techRatio} onChange={(e) => setTechRatio(parseInt(e.target.value))} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span className="cosmic-label" style={{ margin: 0 }}>Aether</span>
              <span style={{ fontSize: '10px' }}>{magicRatio}%</span>
            </div>
            <input type="range" min="0" max="100" className="cosmic-slider" value={magicRatio} onChange={(e) => setMagicRatio(parseInt(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Advanced Custom Lore Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button
          className="btn-cosmic btn-outline"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '8px 12px' }}
          onClick={() => setShowLoreConfig(!showLoreConfig)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Scroll size={13} style={{ color: 'var(--color-purple)' }} />
            Custom Historical Chronicles
          </span>
          <span>{showLoreConfig ? '▲' : '▼'}</span>
        </button>
        {showLoreConfig && (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Inject custom historical timeline events into the generated codex records.</span>
            <textarea
              rows={4}
              placeholder="E.g. Three centuries ago, the skies broke and rained burning sapphire. The oceans froze into liquid glass, trapping the ancient fleets."
              className="cosmic-textarea"
              value={customLore}
              onChange={(e) => setCustomLore(e.target.value)}
              style={{ fontSize: '12px' }}
            />
          </div>
        )}
      </div>

      {/* Advanced Custom Characters Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button
          className="btn-cosmic btn-outline"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '8px 12px' }}
          onClick={() => setShowCharConfig(!showCharConfig)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={13} style={{ color: 'var(--color-amber)' }} />
            Custom Legendary Key Figures ({chars.length})
          </span>
          <span>{showCharConfig ? '▲' : '▼'}</span>
        </button>
        {showCharConfig && (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Added characters list */}
            {chars.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                {chars.map((char, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                    <span style={{ color: 'white', fontWeight: 500 }}>{char.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({char.role})</span>
                    <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-crimson)', cursor: 'pointer', paddingLeft: '4px' }} onClick={() => handleRemoveChar(idx)}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleAddChar} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Name (e.g. Captain Ahab)" className="cosmic-input" style={{ flex: 1, padding: '6px 8px', fontSize: '11px' }} value={newCharName} onChange={(e) => setNewCharName(e.target.value)} />
                <input type="text" placeholder="Role (e.g. Mad Whaler)" className="cosmic-input" style={{ flex: 1, padding: '6px 8px', fontSize: '11px' }} value={newCharRole} onChange={(e) => setNewCharRole(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Starting Node (e.g. Ocean)" className="cosmic-input" style={{ flex: 1, padding: '6px 8px', fontSize: '11px' }} value={newCharNode} onChange={(e) => setNewCharNode(e.target.value)} />
                <input type="text" placeholder="Faction (e.g. Rebels)" className="cosmic-input" style={{ flex: 1, padding: '6px 8px', fontSize: '11px' }} value={newCharFaction} onChange={(e) => setNewCharFaction(e.target.value)} />
              </div>
              <button type="submit" className="btn-cosmic btn-purple" style={{ padding: '6px 12px', fontSize: '10px', height: 'auto' }}>
                + Add Legendary Character
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Forge Master Action Button */}
      <button
        onClick={handleForgeClick}
        disabled={isForging || !prompt.trim()}
        className="btn-cosmic btn-teal animate-pulse-glow"
        style={{ width: '100%', marginTop: 'auto', height: '48px', position: 'relative', overflow: 'hidden' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
          <Settings className={isForging ? 'animate-spin-loom' : ''} size={18} />
          {isForging ? 'SPINNING THE SPINDLE...' : 'FORGE NEW WORLD'}
        </span>
      </button>
    </div>
  );
};
