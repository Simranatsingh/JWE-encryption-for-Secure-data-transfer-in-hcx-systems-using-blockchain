import React, { useState } from 'react';
import axios from 'axios';
import './SecuritySettings.css';

const SecuritySettings = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleUpdatePassword = async () => {
        try {
            await axios.patch('/api/auth/update-password', { password });
            alert('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password');
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await axios.patch('/api/auth/update-email', { email });
            alert('Email updated successfully');
        } catch (error) {
            console.error('Error updating email:', error);
            alert('Failed to update email');
        }
    };

    return (
        <div className="security-settings">
            <h2>Account Settings</h2>
            <div className="settings-section">
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleUpdatePassword} className="btn btn-primary">Update Password</button>
            </div>

            <div className="settings-section">
                <h3>Update Email</h3>
                <input
                    type="email"
                    placeholder="New Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleUpdateEmail} className="btn btn-primary">Update Email</button>
            </div>

            <h2>Blockchain Security</h2>
            <p>Our platform uses advanced encryption and blockchain technology to ensure the security and privacy of your healthcare data.</p>
            <ul>
                <li>End-to-end encryption with JWE</li>
                <li>Immutable records stored on the blockchain</li>
                <li>Decentralized access control</li>
            </ul>
        </div>
    );
};

export default SecuritySettings; 