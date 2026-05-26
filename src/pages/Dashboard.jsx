import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TransactionTable from '../components/TransactionTable';

export default function Dashboard() {
    const [balance, setBalance]               = useState(0);
    const [transactions, setTransactions]     = useState([]);
    const [topupAmount, setTopupAmount]       = useState('');
    const [transferEmail, setTransferEmail]   = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [error, setError]                   = useState('');
    const [success, setSuccess]               = useState('');
    const [loading, setLoading]               = useState(false);
    const { logout }                          = useAuth();
    const navigate                            = useNavigate();

    const fetchData = async () => {
        try {
            const [walletRes, txRes] = await Promise.all([
                api.get('/wallet'),
                api.get('/transactions'),
            ]);
            setBalance(walletRes.data.balance);
            setTransactions(txRes.data.data || []);
        } catch (err) {
            if (err.response?.status === 401) { logout(); navigate('/login'); }
        }
    };

    useEffect(() => { fetchData(); }, []);

    const validateAmount = (value) => {
        if (!value)                     return 'Nominal tidak boleh kosong.';
        if (!/^\d+$/.test(value))       return 'Nominal harus berupa angka.';
        if (parseInt(value) <= 0)       return 'Nominal harus lebih dari 0.';
        if (parseInt(value) > 10000000) return 'Nominal melebihi batas maksimum.';
        return null;
    };

    const handleTopup = async () => {
        const err = validateAmount(topupAmount);
        if (err) { setError(err); setSuccess(''); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            await api.post('/topup', { amount: parseInt(topupAmount) });
            setSuccess('Top-up berhasil.');
            setTopupAmount('');
            fetchData();
        } catch (e) {
            setError(e.response?.data?.message || 'Top-up gagal.');
        } finally { setLoading(false); }
    };

    const handleTransfer = async () => {
        if (!transferEmail) { setError('Email penerima wajib diisi.'); return; }
        const err = validateAmount(transferAmount);
        if (err) { setError(err); setSuccess(''); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            await api.post('/transfer', {
                recipient_email: transferEmail,
                amount: parseInt(transferAmount),
            });
            setSuccess('Transfer berhasil.');
            setTransferEmail(''); setTransferAmount('');
            fetchData();
        } catch (e) {
            setError(e.response?.data?.message || 'Transfer gagal.');
        } finally { setLoading(false); }
    };

    const handleLogout = async () => {
        await api.post('/logout');
        logout();
        navigate('/login');
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid #e5e7eb', borderRadius: 8,
        fontSize: 14, outline: 'none', color: '#111827',
        backgroundColor: '#f9fafb', boxSizing: 'border-box',
        marginBottom: 10,
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, Segoe UI, sans-serif' }}>

            {/* Navbar */}
            <div style={{
                background: 'white',
                padding: '0 32px',
                height: 60,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                position: 'sticky', top: 0, zIndex: 10
            }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#1e3a8a', letterSpacing: 0.3 }}>
                    Mini Wallet
                </span>
                <button onClick={handleLogout} style={{
                    padding: '7px 18px',
                    background: 'white',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: 13
                }}>
                    Logout
                </button>
            </div>

            <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 20px' }}>

                {/* Alert */}
                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fecaca',
                        color: '#dc2626', padding: '12px 16px',
                        borderRadius: 8, marginBottom: 20, fontSize: 13
                    }}>{error}</div>
                )}
                {success && (
                    <div style={{
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        color: '#16a34a', padding: '12px 16px',
                        borderRadius: 8, marginBottom: 20, fontSize: 13
                    }}>{success}</div>
                )}

                {/* Saldo Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 100%)',
                    borderRadius: 16,
                    padding: '32px 36px',
                    marginBottom: 24,
                    boxShadow: '0 8px 32px rgba(30, 58, 138, 0.25)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                            Total Saldo
                        </p>
                        <h2 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: 0.5 }}>
                            Rp {balance.toLocaleString('id-ID')}
                        </h2>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 600
                    }}>
                        Aktif
                    </div>
                </div>

                {/* Grid Top-up & Transfer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

                    {/* Top-up */}
                    <div style={{
                        background: 'white', padding: '24px',
                        borderRadius: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <h4 style={{ margin: '0 0 4px', color: '#0f172a', fontSize: 15, fontWeight: 700 }}>
                            Top-up Saldo
                        </h4>
                        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8' }}>
                            Tambah saldo ke dompet Anda
                        </p>
                        <input
                            type="text"
                            placeholder="Masukkan nominal"
                            value={topupAmount}
                            onChange={e => setTopupAmount(e.target.value)}
                            style={inputStyle}
                        />
                        <button
                            onClick={handleTopup}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '11px',
                                background: loading ? '#94a3b8' : '#1e3a8a',
                                color: 'white', border: 'none',
                                borderRadius: 8, fontSize: 14,
                                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                letterSpacing: 0.2
                            }}
                        >
                            {loading ? 'Memproses...' : 'Top-up'}
                        </button>
                    </div>

                    {/* Transfer */}
                    <div style={{
                        background: 'white', padding: '24px',
                        borderRadius: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <h4 style={{ margin: '0 0 4px', color: '#0f172a', fontSize: 15, fontWeight: 700 }}>
                            Transfer
                        </h4>
                        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8' }}>
                            Kirim saldo ke pengguna lain
                        </p>
                        <input
                            type="email"
                            placeholder="Email penerima"
                            value={transferEmail}
                            onChange={e => setTransferEmail(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Nominal transfer"
                            value={transferAmount}
                            onChange={e => setTransferAmount(e.target.value)}
                            style={inputStyle}
                        />
                        <button
                            onClick={handleTransfer}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '11px',
                                background: loading ? '#94a3b8' : '#1e3a8a',
                                color: 'white', border: 'none',
                                borderRadius: 8, fontSize: 14,
                                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                letterSpacing: 0.2
                            }}
                        >
                            {loading ? 'Memproses...' : 'Transfer'}
                        </button>
                    </div>
                </div>

                {/* Tabel Transaksi */}
                <div style={{
                    background: 'white', padding: '24px',
                    borderRadius: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #f1f5f9'
                }}>
                    <h4 style={{ margin: '0 0 4px', color: '#0f172a', fontSize: 15, fontWeight: 700 }}>
                        Riwayat Transaksi
                    </h4>
                    <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8' }}>
                        Semua aktivitas transaksi Anda
                    </p>
                    <TransactionTable transactions={transactions} />
                </div>
            </div>
        </div>
    );
}