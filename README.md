# HCX Secure Data Transfer System

A blockchain-based secure data transfer system for Health Claims Exchange (HCX) built with the MERN stack.

## Features

- Secure data transfer using blockchain technology
- Role-based access control (Patient, Doctor, Insurance Provider)
- JWT-based authentication
- Encrypted data storage using JWE
- File upload and encrypted storage system
- MongoDB database integration
- React frontend with Vite
- Express.js backend

## Project Structure

```
hcx-secure-transfer/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── smart-contracts/        # Blockchain smart contracts
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- MetaMask or similar Web3 wallet
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```
3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Copy the example environment variables and fill in your values

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
WEB3_PROVIDER=your_web3_provider
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_WEB3_PROVIDER=your_web3_provider
```

## Security Features

- JWT-based authentication
- Role-based access control
- End-to-end encryption using JWE
- Blockchain-based data verification
- Secure file storage with encryption
- Input validation and sanitization

## License

MIT 