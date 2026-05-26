import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate              = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.phone || !form.password) {
            setError('Semua field wajib diisi.'); return;
        }
        setLoading(true); setError(''); setSuccess('');
        try {
            await api.post('/register', form);
            setSuccess('Registrasi berhasil! Silakan login.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                setError(Object.values(errors)[0][0]);
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal.');
            }
        } finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '12px 14px', marginBottom: 18,
        border: '1.5px solid #e5e7eb', borderRadius: 8,
        fontSize: 14, outline: 'none', color: '#111827',
        backgroundColor: '#f9fafb', boxSizing: 'border-box'
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
                        Buat Akun
                    </h2>
                    <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                        Daftar untuk mulai menggunakan Mini Wallet
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
                    {success && (
                        <div style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            color: '#16a34a', padding: '11px 14px',
                            borderRadius: 8, marginBottom: 20, fontSize: 13
                        }}>{success}</div>
                    )}

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Nama Lengkap
                    </label>
                    <input
                        type="text" name="name"
                        placeholder="Nama lengkap"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Email
                    </label>
                    <input
                        type="email" name="email"
                        placeholder="contoh@email.com"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Nomor HP
                    </label>
                    <input
                        type="text" name="phone"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        Password
                    </label>
                    <input
                        type="password" name="password"
                        placeholder="Minimal 8 karakter"
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={e => e.key === 'Enter' && handleRegister()}
                        style={{ ...inputStyle, marginBottom: 24 }}
                    />

                    <button
                        onClick={handleRegister}
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
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', margin: 0 }}>
                        Sudah punya akun?{' '}
                        <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}