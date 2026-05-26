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
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            }
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
        width: '100%',
        padding: '11px 14px',
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
        backgroundColor: '#ffffff',
        marginBottom: 10,
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>

            {/* Navbar */}
            <div style={{
                background: 'white',
                padding: '16px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>Mini Wallet</span>
                <button onClick={handleLogout} style={{
                    padding: '8px 18px',
                    background: 'white',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: 14
                }}>
                    Logout
                </button>
            </div>

            <div style={{ maxWidth: 720, margin: '32px auto', padding: '0 16px' }}>

                {/* Alert */}
                {error && (
                    <div style={{
                        background: '#fee2e2', border: '1px solid #fca5a5',
                        color: '#dc2626', padding: '12px 16px',
                        borderRadius: '8px', marginBottom: 16, fontSize: 14
                    }}>{error}</div>
                )}
                {success && (
                    <div style={{
                        background: '#dcfce7', border: '1px solid #86efac',
                        color: '#16a34a', padding: '12px 16px',
                        borderRadius: '8px', marginBottom: 16, fontSize: 14
                    }}>{success}</div>
                )}

                {/* Saldo */}
                <div style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '28px 32px',
                    borderRadius: '12px',
                    marginBottom: 24
                }}>
                    <p style={{ margin: '0 0 6px', fontSize: 14, opacity: 0.85 }}>Saldo Kamu</p>
                    <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
                        Rp {balance.toLocaleString('id-ID')}
                    </h2>
                </div>

                {/* Grid Top-up & Transfer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

                    {/* Top-up */}
                    <div style={{
                        background: 'white', padding: '24px',
                        borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}>
                        <h4 style={{ margin: '0 0 16px', color: '#111827', fontSize: 16 }}>Top-up Saldo</h4>
                        <input
                            type="text"
                            placeholder="Nominal top-up"
                            value={topupAmount}
                            onChange={e => setTopupAmount(e.target.value)}
                            style={inputStyle}
                        />
                        <button
                            onClick={handleTopup}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '11px',
                                background: loading ? '#93c5fd' : '#2563eb',
                                color: 'white', border: 'none',
                                borderRadius: '8px', fontSize: 14,
                                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Memproses...' : 'Top-up'}
                        </button>
                    </div>

                    {/* Transfer */}
                    <div style={{
                        background: 'white', padding: '24px',
                        borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}>
                        <h4 style={{ margin: '0 0 16px', color: '#111827', fontSize: 16 }}>Transfer</h4>
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
                                background: loading ? '#86efac' : '#16a34a',
                                color: 'white', border: 'none',
                                borderRadius: '8px', fontSize: 14,
                                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Memproses...' : 'Transfer'}
                        </button>
                    </div>
                </div>

                {/* Tabel Transaksi */}
                <div style={{
                    background: 'white', padding: '24px',
                    borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                    <h4 style={{ margin: '0 0 16px', color: '#111827', fontSize: 16 }}>Riwayat Transaksi</h4>
                    <TransactionTable transactions={transactions} />
                </div>
            </div>
        </div>
    );
}