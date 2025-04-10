import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header className="hero-section">
                <h1>Secure. Decentralized. Healthcare Data You Control.</h1>
                <p>Experience the future of healthcare data management with blockchain technology.</p>
                <div className="cta-buttons">
                    <Link to="/register" className="btn btn-primary">Get Started</Link>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </header>
            <section className="overview">
                <h2>Why Choose Our Platform?</h2>
                <p>Our blockchain-based system ensures the highest level of security and privacy for your healthcare data.</p>
                <ul>
                    <li>Immutable records</li>
                    <li>Decentralized access control</li>
                    <li>End-to-end encryption</li>
                </ul>
            </section>
            <section className="partners">
                <h2>Our Trusted Partners</h2>
                <div className="partner-logos">
                    {/* Add partner logos here */}
                </div>
            </section>
        </div>
    );
};

export default LandingPage; 