import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Sparkles, User, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password, remember);
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
        background: 'radial-gradient(circle at 50% 50%, rgba(167, 85, 247, 0.15) 0%, transparent 60%)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle at 10% 20%, rgba(0, 242, 254, 0.08) 0%, transparent 50%)',
        zIndex: 0,
        animation: 'spin 180s linear infinite',
      }} />

      <form 
        onSubmit={handleSubmit} 
        style={{
          background: 'rgba(13, 14, 22, 0.75)',
          padding: '40px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 25px rgba(167, 85, 247, 0.2)',
          border: '1px solid rgba(167, 85, 247, 0.3)',
          backdropFilter: 'blur(20px)',
          color: '#f8fafc',
          width: '380px',
          fontFamily: 'var(--font-sans)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(167, 85, 247, 0.15)',
            border: '1px solid var(--color-purple)',
            marginBottom: '16px',
            boxShadow: '0 0 15px rgba(167, 85, 247, 0.4)',
          }}>
            <Sparkles style={{ color: 'var(--color-teal)' }} size={28} />
          </div>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '28px', 
            letterSpacing: '2px',
            color: 'var(--text-primary)',
            textShadow: '0 0 10px rgba(0, 242, 254, 0.3)',
            margin: '0 0 6px 0',
          }}>
            COSMOGONY
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Enter the Multiverse Weaver
          </p>
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={12} style={{ color: 'var(--color-teal)' }} /> Username
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
            <Lock size={12} style={{ color: 'var(--color-purple)' }} /> Password
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

        {/* Remember me */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            id="remember"
            style={{
              accentColor: 'var(--color-purple)',
              cursor: 'pointer',
            }}
          />
          <label htmlFor="remember" style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none' }}>
            Preserve Timeline Connection (Remember me)
          </label>
        </div>

        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '12px',
            background: isHovered 
              ? 'linear-gradient(135deg, var(--color-purple) 0%, #bb82fc 100%)' 
              : 'linear-gradient(135deg, var(--color-purple) 0%, rgba(167, 85, 247, 0.75) 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isHovered ? '0 0 20px rgba(167, 85, 247, 0.5)' : '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LogIn size={15} /> Link Consciousness
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Uninitiated Explorer? </span>
          <a href="/signup" style={{ 
            color: 'var(--color-teal)', 
            textDecoration: 'none', 
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-teal)'}
          >
            Forge a New Soul Core
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
