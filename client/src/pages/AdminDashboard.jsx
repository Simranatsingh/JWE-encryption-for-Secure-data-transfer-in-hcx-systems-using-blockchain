import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch users
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Fetch transactions
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/admin/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchUsers();
        fetchTransactions();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <h3>Users</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.username} - {user.role}</li>
                ))}
            </ul>

            <h3>Transactions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{tx.id}</td>
                            <td>{tx.action}</td>
                            <td>{tx.user}</td>
                            <td>{new Date(tx.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard; 