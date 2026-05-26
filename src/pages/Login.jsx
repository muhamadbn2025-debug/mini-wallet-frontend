import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ margin: '0 0 6px', color: '#111827', fontSize: 24, fontWeight: 700 }}>
            Mini Wallet
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            Masuk ke akun Anda
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 600,
            color: '#374151',
            fontSize: 14
          }}>
            Email
          </label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1.5px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 600,
            color: '#374151',
            fontSize: 14
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1.5px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              color: '#111827',
              backgroundColor: '#ffffff',
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', margin: '16px 0 0' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}