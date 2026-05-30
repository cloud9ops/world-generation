import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple signup flow: store user with chosen title
    signup(username, password, title || 'Novice Explorer');
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
        width: '340px',
        fontFamily: 'var(--font-sans)',
      }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Create Cosmogony Account</h2>
        <div style={{ marginBottom: '12px' }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Initial Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Novice Explorer"
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Sign Up</button>
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'var(--color-teal)' }}>Already have an account? Log in</a>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  marginTop: '4px',
  borderRadius: '4px',
  border: 'none',
  background: '#222',
  color: '#fff',
};

const buttonStyle = {
  width: '100%',
  padding: '8px',
  background: 'var(--color-purple)',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

export default SignupPage;
