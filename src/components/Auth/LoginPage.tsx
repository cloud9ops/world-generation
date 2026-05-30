import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

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
      background: 'var(--bg-page)',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(20,20,20,0.85)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        width: '320px',
        fontFamily: 'var(--font-sans)',
      }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Cosmogony Login</h2>
        <div style={{ marginBottom: '12px' }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '6px',
              marginTop: '4px',
              borderRadius: '4px',
              border: 'none',
              background: '#222',
              color: '#fff',
            }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '6px',
              marginTop: '4px',
              borderRadius: '4px',
              border: 'none',
              background: '#222',
              color: '#fff',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            id="remember"
          />
          <label htmlFor="remember" style={{ marginLeft: '6px' }}>Remember me</label>
        </div>
        <button type="submit" style={{
          width: '100%',
          padding: '8px',
          background: 'var(--color-purple)',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
        }}>
          Login
        </button>
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <a href="/signup" style={{ color: 'var(--color-teal)' }}>Create account</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
