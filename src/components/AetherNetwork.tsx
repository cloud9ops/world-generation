import React, { useState, useEffect, useRef } from 'react';
import { Send, Globe, ShieldAlert, Zap } from 'lucide-react';
import type { AetherMessage } from '../engine/secretEngine';
import { getAetherMessages, sendAetherMessage } from '../engine/secretEngine';

interface AetherNetworkProps {
  onReturn: () => void;
  playerName: string;
  lockedTitle: string;
}

export const AetherNetwork: React.FC<AetherNetworkProps> = ({ onReturn, playerName, lockedTitle }) => {
  const [messages, setMessages] = useState<AetherMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  
  const senderHandle = `${playerName}, the ${lockedTitle}`;
  
  // Teaser Codex State
  const [selectedRelic, setSelectedRelic] = useState<'origin_breaker' | 'aether_lens' | 'gravity_well' | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getAetherMessages());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const updated = sendAetherMessage(senderHandle, newMsg.trim());
    setMessages(updated);
    setNewMsg('');

    // Trigger a funny simulated system response a second later!
    setTimeout(() => {
      const responsePool = [
        "Multiverse ping received. Sector synchronization stable.",
        "Oracle of the Spires nod: 'Another thread joins the weave. Welcome, traveler.'",
        "Aether_Weaver_Anya: 'Nice handle! What was your starting world prompt?'",
        "Warning: Minor gravitational anomaly detected in nearby coordinate node."
      ];
      const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      
      const currentMsgs = getAetherMessages();
      const sysMsg: AetherMessage = {
        id: `sys_${Date.now()}`,
        sender: "AETHER_RESONATOR",
        content: randomResponse,
        timestamp: "Sync Chronos",
        type: "system"
      };
      
      const finalMsgs = [...currentMsgs, sysMsg];
      localStorage.setItem('cosmogony_aether_chat_logs', JSON.stringify(finalMsgs));
      setMessages(finalMsgs);
    }, 1500);
  };

  return (
    <div 
      className="glass-panel glass-panel-glow-purple animate-typewriter"
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-light)',
        boxShadow: '0 0 35px rgba(155, 81, 224, 0.15)',
        overflow: 'hidden'
      }}
    >
      
      {/* LEFT COLUMN: AETHER CHAT terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', borderRight: '1px solid var(--border-light)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(155, 81, 224, 0.2)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe className="animate-pulse-glow" style={{ color: 'var(--color-purple)' }} size={24} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 className="heading-glow" style={{ fontSize: '20px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', letterSpacing: '1px' }}>
                Aether Network
              </h1>
              <span style={{ fontSize: '10px', color: 'var(--color-teal)' }}>🌌 SECURE BROADCAST GATEWAY // MULTIVERSE LEVEL 11</span>
            </div>
          </div>

          <button onClick={onReturn} className="btn-cosmic btn-outline" style={{ padding: '6px 12px', fontSize: '11px', border: '1px solid var(--color-purple)' }}>
            ← Return to Star Map
          </button>
        </div>

        {/* Messages Feed */}
        <div 
          className="terminal-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'rgba(15, 23, 42, 0.03)',
            border: '1px solid rgba(155, 81, 224, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}
        >
          {messages.map(msg => {
            let borderClass = 'aether-msg-multiverse';
            if (msg.type === 'enlightened') borderClass = 'aether-msg-enlightened';
            if (msg.type === 'system') borderClass = 'aether-msg-sys';

            return (
              <div key={msg.id} className={`aether-chat-msg ${borderClass} animate-typewriter`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span style={{ color: msg.type === 'enlightened' ? 'var(--color-purple)' : msg.type === 'system' ? 'var(--color-amber)' : 'var(--color-teal)', fontWeight: 600 }}>
                    ⚡ {msg.sender}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p style={{ color: msg.type === 'system' ? 'var(--color-amber)' : 'var(--text-primary)', lineHeight: '1.4' }}>
                  {msg.content}
                </p>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(155, 81, 224, 0.05)', 
              border: '1px solid var(--border-light)', 
              color: 'var(--text-primary)', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              maxWidth: '260px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={senderHandle}
          >
            📡 {senderHandle}
          </div>
          <input
            type="text"
            placeholder="Transmit cosmic logs through the void..."
            className="cosmic-input"
            style={{ flex: 1, fontSize: '12px' }}
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button type="submit" className="btn-cosmic btn-purple" style={{ padding: '0 20px' }}>
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: RELIC BLUEPRINTS ( Teasing Future Plans! ) */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(155, 81, 224, 0.2)', paddingBottom: '10px', marginBottom: '16px' }}>
          <Zap style={{ color: 'var(--color-amber)' }} size={18} />
          <h2 style={{ fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Origin Blueprints
          </h2>
        </div>
        
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
          By compiling the gravitational waves of the 11 fragments, we have decrypted blueprint vectors for **Higher-Order Relics**. 
          <br/>
          <span style={{ color: 'var(--color-amber)' }}>These relics exceed current local timeline parameters.</span>
        </p>

        {/* Relics list selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Relic 1: Origin Breaker */}
          <button
            onClick={() => setSelectedRelic(selectedRelic === 'origin_breaker' ? null : 'origin_breaker')}
            className="glass-card glass-card-hover"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              border: selectedRelic === 'origin_breaker' ? '1px solid var(--color-crimson)' : '1px solid var(--border-light)',
              background: selectedRelic === 'origin_breaker' ? 'rgba(255, 75, 92, 0.05)' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ color: 'var(--color-crimson)', fontWeight: 600, fontSize: '13px' }}>⚙ [ORIGIN BREAKER]</span>
              <span style={{ fontSize: '9px', background: 'rgba(255, 75, 92, 0.2)', color: 'var(--color-crimson)', padding: '1px 5px', borderRadius: '3px' }}>Roadmap</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Class-Omega multiversal threshold intruder.</p>
            {selectedRelic === 'origin_breaker' && (
              <div className="animate-typewriter animate-flash-red" style={{ marginTop: '8px', borderTop: '1px dashed rgba(255,75,92,0.3)', paddingTop: '8px', fontSize: '10px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-crimson)', fontWeight: 'bold', marginBottom: '4px' }}>
                  <ShieldAlert size={12} />
                  <span>INVASION HAZARD VECTOR</span>
                </div>
                <span>
                  Allows players to cross timeline thresholds to breach other active players' coordinate grids randomly as **"Harbingers of the Hidden Dimension"**.
                  <br/>
                  <span style={{ color: 'var(--text-muted)' }}>Status: Coordinates locked. Requires future phase compilation. Only one weave execution permitted.</span>
                </span>
              </div>
            )}
          </button>

          {/* Relic 2: Aether Lens */}
          <button
            onClick={() => setSelectedRelic(selectedRelic === 'aether_lens' ? null : 'aether_lens')}
            className="glass-card glass-card-hover"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              border: selectedRelic === 'aether_lens' ? '1px solid var(--color-teal)' : '1px solid var(--border-light)',
              background: selectedRelic === 'aether_lens' ? 'rgba(0, 242, 254, 0.05)' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ color: 'var(--color-teal)', fontWeight: 600, fontSize: '13px' }}>👁 [AETHER RESONATOR LENS]</span>
              <span style={{ fontSize: '9px', background: 'rgba(0, 242, 254, 0.2)', color: 'var(--color-teal)', padding: '1px 5px', borderRadius: '3px' }}>Roadmap</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Passive timeline distortion visualizer.</p>
            {selectedRelic === 'aether_lens' && (
              <div className="animate-typewriter" style={{ marginTop: '8px', borderTop: '1px dashed rgba(0,242,254,0.3)', paddingTop: '8px', fontSize: '10px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                <span>
                  Bends light refractions inside the starlit node SVG map. Unlocks coordinate sight to show where hidden micro-fragments reside in nearby sectors with 100% accuracy.
                  <br/>
                  <span style={{ color: 'var(--text-muted)' }}>Status: Blueprint decrypted. Requires synchronization core.</span>
                </span>
              </div>
            )}
          </button>

          {/* Relic 3: Gravity Spindle */}
          <button
            onClick={() => setSelectedRelic(selectedRelic === 'gravity_well' ? null : 'gravity_well')}
            className="glass-card glass-card-hover"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              border: selectedRelic === 'gravity_well' ? '1px solid var(--color-purple)' : '1px solid var(--border-light)',
              background: selectedRelic === 'gravity_well' ? 'rgba(155, 81, 224, 0.05)' : 'var(--bg-card)',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ color: 'var(--color-purple)', fontWeight: 600, fontSize: '13px' }}>🌪 [SINGULARITY SPINDLE]</span>
              <span style={{ fontSize: '9px', background: 'rgba(155, 81, 224, 0.2)', color: 'var(--color-purple)', padding: '1px 5px', borderRadius: '3px' }}>Roadmap</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active gravitational vortex projector.</p>
            {selectedRelic === 'gravity_well' && (
              <div className="animate-typewriter" style={{ marginTop: '8px', borderTop: '1px dashed rgba(155,81,224,0.3)', paddingTop: '8px', fontSize: '10px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                <span>
                  Collapses designated sectors of generated worlds to force-regenerate biome structures and faction motives, without needing to forge an entirely new star grid.
                  <br/>
                  <span style={{ color: 'var(--text-muted)' }}>Status: Inactive blueprint. Reserved for subsequent phase releases.</span>
                </span>
              </div>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
