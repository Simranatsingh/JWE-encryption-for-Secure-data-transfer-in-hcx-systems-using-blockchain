import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const history = useHistory();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/register', { username, email, password, role });
            localStorage.setItem('token', response.data.token);
            history.push('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            alert('Failed to register. Please try again.');
        }
    };

    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="healthcare_provider">Healthcare Provider</option>
                    <option value="insurance_provider">Insurance Provider</option>
                </select>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup; 