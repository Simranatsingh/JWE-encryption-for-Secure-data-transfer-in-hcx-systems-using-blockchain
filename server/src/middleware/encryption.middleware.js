const { encryptData, decryptData } = require('../utils/encryption');

const encryptionMiddleware = async (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;

    // Override the send function to encrypt data
    res.send = async function (data) {
        try {
            if (!req.user || !req.user.publicKey) {
                // If no user or public key, send as normal
                return originalSend.call(this, data);
            }

            // Encrypt the data using the user's public key
            const encrypted = await encryptData(data, req.user.publicKey);
            
            // Send encrypted data
            return originalSend.call(this, {
                encrypted: encrypted.jweToken,
                key: encrypted.key // This should be encrypted with user's wallet public key in production
            });
        } catch (error) {
            console.error('Encryption middleware error:', error);
            return res.status(500).json({ message: 'Encryption failed' });
        }
    };

    next();
};

const decryptionMiddleware = async (req, res, next) => {
    try {
        if (req.body.encrypted && req.body.key) {
            // Decrypt the data using the private key (in real scenario, this would use user's wallet)
            const decrypted = await decryptData(
                req.body.encrypted,
                req.user.privateKey, // In real scenario, this would be handled by wallet
                req.body.key
            );
            req.body = decrypted;
        }
        next();
    } catch (error) {
        console.error('Decryption middleware error:', error);
        return res.status(400).json({ message: 'Decryption failed' });
    }
};

module.exports = {
    encryptionMiddleware,
    decryptionMiddleware
}; 