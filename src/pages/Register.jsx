import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: ''
    });
    const [error, setError]   = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.phone || !form.password) {
            setError('Semua field wajib diisi.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/register', form);
            setSuccess('Registrasi berhasil! Silakan login.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const first = Object.values(errors)[0][0];
                setError(first);
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '11px 14px',
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
        backgroundColor: '#ffffff',
        marginBottom: 14,
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
                maxWidth: '420px'
            }}>
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ margin: '0 0 6px', color: '#111827', fontSize: 24, fontWeight: 700 }}>
                        Buat Akun
                    </h2>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
                        Daftar untuk mulai menggunakan Mini Wallet
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2', border: '1px solid #fca5a5',
                        color: '#dc2626', padding: '10px 14px',
                        borderRadius: '8px', marginBottom: '16px', fontSize: 14
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: '#dcfce7', border: '1px solid #86efac',
                        color: '#16a34a', padding: '10px 14px',
                        borderRadius: '8px', marginBottom: '16px', fontSize: 14
                    }}>
                        {success}
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nama lengkap"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="contoh@email.com"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Nomor HP
                    </label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Minimal 8 karakter"
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={e => e.key === 'Enter' && handleRegister()}
                        style={inputStyle}
                    />
                </div>

                <button
                    onClick={handleRegister}
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
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: 16
                    }}
                >
                    {loading ? 'Memproses...' : 'Daftar'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', margin: 0 }}>
                    Sudah punya akun?{' '}
                    <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}