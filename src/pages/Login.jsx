import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login }               = useAuth();
    const navigate                = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) { setError('Email dan password wajib diisi.'); return; }
        setLoading(true); setError('');
        try {
            const res = await api.post('/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal');
        } finally { setLoading(false); }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: 'Inter, Segoe UI, sans-serif',
            padding: 20
        }}>
            <div style={{
                width: '100%',
                maxWidth: 420,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a, #4f46e5)',
                    padding: '36px 40px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: 'white' }}>
                        Mini Wallet
                    </h2>
                    <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                        Masuk ke akun Anda
                    </p>
                </div>

                {/* Form */}
                <div style={{ background: 'white', padding: '36px 40px' }}>
                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            color: '#dc2626', padding: '11px 14px',
                            borderRadius: 8, marginBottom: 20, fontSize: 13
                        }}>{error}</div>
                    )}

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="contoh@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 14px', marginBottom: 18,
                            border: '1.5px solid #e5e7eb', borderRadius: 8,
                            fontSize: 14, outline: 'none', color: '#111827',
                            backgroundColor: '#f9fafb', boxSizing: 'border-box'
                        }}
                    />

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{
                            width: '100%', padding: '12px 14px', marginBottom: 24,
                            border: '1.5px solid #e5e7eb', borderRadius: 8,
                            fontSize: 14, outline: 'none', color: '#111827',
                            backgroundColor: '#f9fafb', boxSizing: 'border-box'
                        }}
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '13px',
                            background: loading ? '#94a3b8' : '#1e3a8a',
                            color: 'white', border: 'none', borderRadius: 8,
                            fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: 18,
                            letterSpacing: 0.3
                        }}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', margin: 0 }}>
                        Belum punya akun?{' '}
                        <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}