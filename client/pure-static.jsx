import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div className="container">
      <header>
        <h1>HCX Secure Transfer</h1>
        <div className="subtitle">Static Version</div>
      </header>
      
      <main>
        <section className="info-box">
          <h2>Under Deployment</h2>
          <p>
            The interactive version of HCX Secure Transfer is currently being configured for deployment.
            Please check back soon for the full application.
          </p>
          <p>
            HCX Secure Transfer provides end-to-end encrypted health data transfer with blockchain verification.
          </p>
          <div className="buttons">
            <a href="https://github.com/Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain" className="btn primary">View Source Code</a>
          </div>
        </section>
      </main>
      
      <footer>
        <p>© 2025 HCX Secure Transfer</p>
      </footer>
    </div>
  );
}

// For a pure static version, we would render this to HTML
// This is just for reference and won't be used directly
if (typeof document !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

export default App; 