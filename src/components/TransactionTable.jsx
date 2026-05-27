export default function TransactionTable({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return (
            <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
                Belum ada transaksi.
            </p>
        );
    }

    const typeLabel = {
        topup: 'Top-up',
        transfer_in: 'Masuk',
        transfer_out: 'Keluar',
    };

    const typeColor = {
        topup: '#16a34a',
        transfer_in: '#16a34a',
        transfer_out: '#dc2626',
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Tanggal', 'Tipe', 'Nominal', 'Keterangan'].map(h => (
                        <th key={h} style={{
                            padding: '10px 12px', textAlign: 'left',
                            color: '#6b7280', fontWeight: 600, fontSize: 13
                        }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {transactions.map((tx, i) => (
                    <tr key={tx.id} style={{
                        borderBottom: '1px solid #f3f4f6',
                        background: i % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                        <td style={{ padding: '12px 12px', color: '#374151' }}>
                            {new Date(tx.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                            <span style={{
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontSize: 12,
                                fontWeight: 600,
                                color: typeColor[tx.type],
                                background: typeColor[tx.type] + '18'
                            }}>
                                {typeLabel[tx.type] || tx.type}
                            </span>
                        </td>
                        <td style={{ padding: '12px 12px', fontWeight: 600, color: typeColor[tx.type] }}>
                            {tx.type === 'transfer_out' ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '12px 12px', color: '#6b7280' }}>
                            {tx.description}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}