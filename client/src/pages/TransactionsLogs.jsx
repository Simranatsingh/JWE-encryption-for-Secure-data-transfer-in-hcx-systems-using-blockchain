import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsLogs.css';

const TransactionsLogs = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch blockchain transactions
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/blockchain/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="transactions-logs">
            <h2>Blockchain Transactions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Timestamp</th>
                        <th>Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{tx.id}</td>
                            <td>{tx.action}</td>
                            <td>{tx.user}</td>
                            <td>{new Date(tx.timestamp).toLocaleString()}</td>
                            <td>{tx.hash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsLogs; 