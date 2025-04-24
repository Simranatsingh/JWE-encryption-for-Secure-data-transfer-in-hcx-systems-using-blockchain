# HCX Secure Transfer - Client

This is the frontend application for HCX Secure Transfer, a system for secure health data transfer using blockchain verification and end-to-end encryption.

## Features

- End-to-end encrypted health data transfer
- Blockchain verification for immutable records
- Decentralized file storage with IPFS support
- Responsive, modern UI
- Direct integration with Supabase for serverless deployment

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at http://localhost:5173 (or next available port).

## Deployment

### Vercel Deployment

We've included Vercel configuration for easy deployment:

1. Set root directory to `client`
2. Use framework preset `Vite`
3. The configuration in `vercel.json` handles the rest

For detailed instructions, see [FLEEK_DEPLOYMENT.md](./FLEEK_DEPLOYMENT.md).

### Fleek Deployment (IPFS)

For IPFS deployment via Fleek:

1. Use the `build-for-fleek.sh` script at the repository root
2. Set publish directory to `client/dist`

For detailed instructions, see [FLEEK_DEPLOYMENT.md](./FLEEK_DEPLOYMENT.md).

## Environment Variables

Create a `.env` file with these variables:

```
VITE_SUPABASE_URL=https://ekhuscbqsqrljhkzukak.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHVzY2Jxc3FybGpoa3p1a2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTU2MjAsImV4cCI6MjA2MDk3MTYyMH0.LS9TlpTsYNW859wHMwjdGkitDOcC5-YkkR93VKXCwDE
VITE_API_URL=http://localhost:5005
```

For production, add the appropriate `VITE_VERCEL_DEPLOYMENT=true` or `VITE_FLEEK_DEPLOYMENT=true`.

## Project Structure

- `src/` - Application source code
  - `components/` - Reusable UI components
  - `pages/` - Application pages/routes
  - `contexts/` - React context providers
  - `services/` - API and external service integrations
  - `utils/` - Helper functions and utilities
  - `App.jsx` - Root component
  - `main.jsx` - Application entry point

## License

This project is licensed under the MIT License - see the LICENSE file for details. 