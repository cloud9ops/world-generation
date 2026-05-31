import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, User, Lock, Award, ShieldAlert } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(username, password, title || 'Novice Explorer');
    navigate('/', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#040209',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background stardust layers */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.12) 0%, transparent 60%)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle at 90% 80%, rgba(167, 85, 247, 0.08) 0%, transparent 50%)',
        zIndex: 0,
        animation: 'spin 220s linear infinite',
      }} />

      <form 
        onSubmit={handleSubmit} 
        style={{
          background: 'rgba(13, 14, 22, 0.75)',
          padding: '40px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.2)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          backdropFilter: 'blur(20px)',
          color: '#f8fafc',
          width: '400px',
          fontFamily: 'var(--font-sans)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(0, 242, 254, 0.12)',
            border: '1px solid var(--color-teal)',
            marginBottom: '16px',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
          }}>
            <Sparkles style={{ color: 'var(--color-purple)' }} size={28} />
          </div>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '28px', 
            letterSpacing: '2px',
            color: 'var(--text-primary)',
            textShadow: '0 0 10px rgba(167, 85, 247, 0.3)',
            margin: '0 0 6px 0',
          }}>
            SOUL CORE FORGE
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Initialize your Cosmic Chronicle Record
          </p>
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={12} style={{ color: 'var(--color-teal)' }} /> Explorer Designation (Username)
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="e.g. Captain Ahab"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid var(--color-teal)';
              e.target.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} style={{ color: 'var(--color-purple)' }} /> Consciousness Key (Password)
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid var(--color-purple)';
              e.target.style.boxShadow = '0 0 10px rgba(167, 85, 247, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          />
        </div>

        {/* Initial Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={12} style={{ color: 'var(--color-amber)' }} /> Initial Explorer Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Star Drifter"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid var(--color-amber)';
              e.target.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '6px', 
            background: 'rgba(255, 184, 0, 0.05)', 
            border: '1px solid rgba(255, 184, 0, 0.1)', 
            borderRadius: '6px', 
            padding: '6px 8px',
            marginTop: '2px'
          }}>
            <ShieldAlert size={12} style={{ color: 'var(--color-amber)', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              Your title sets your cosmic beginning. As your meta-progression surges and explored constellations expand, this designation will mutate.
            </span>
          </div>
        </div>

        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '12px',
            background: isHovered 
              ? 'linear-gradient(135deg, var(--color-teal) 0%, #66fbfd 100%)' 
              : 'linear-gradient(135deg, var(--color-teal) 0%, rgba(0, 242, 254, 0.75) 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#050508',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isHovered ? '0 0 20px rgba(0, 242, 254, 0.5)' : '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sparkles size={15} /> Forge Soul Matrix
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Registered Core? </span>
          <a href="/login" style={{ 
            color: 'var(--color-purple)', 
            textDecoration: 'none', 
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-purple)'}
          >
            Reconnect Consciousness
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
