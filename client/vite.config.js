import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  const isWeb3Mode = env.VITE_WEB3_MODE === 'true';

  return {
    plugins: [react()],
    base: isWeb3Mode ? './' : '/', // Use relative paths for IPFS deployment
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5005',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        zlib: 'browserify-zlib',
        util: 'util',
      },
    },
    define: {
      'import.meta.env.CONTRACT_ADDRESS': JSON.stringify(isWeb3Mode ? env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000' : 'your_deployed_contract_address'),
      'import.meta.env.INFURA_PROJECT_ID': JSON.stringify(isWeb3Mode ? env.INFURA_PROJECT_ID || '' : 'your_infura_project_id'),
      'import.meta.env.IPFS_API_KEY': JSON.stringify(isWeb3Mode ? env.IPFS_API_KEY || '' : 'your_ipfs_api_key'),
      'import.meta.env.IPFS_API_SECRET': JSON.stringify(isWeb3Mode ? env.IPFS_API_SECRET || '' : 'your_ipfs_api_secret'),
      'import.meta.env.VITE_API_URL': JSON.stringify(isWeb3Mode ? 'https://api.yourwebsite.com/api' : 'http://localhost:5005/api'),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.WEB3_MODE': JSON.stringify(isWeb3Mode ? 'true' : 'false'),
      'global': 'globalThis',
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isWeb3Mode,
      minify: isWeb3Mode ? 'esbuild' : false,
      rollupOptions: {
        onwarn(warning, warn) {
          // Skip certain warnings
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              warning.message.includes('motion-utils') && 
              warning.message.includes('{}-config.mjs')) {
            return;
          }
          // Skip circular dependency warnings from ethers.js
          if (warning.code === 'CIRCULAR_DEPENDENCY' && 
              (warning.message.includes('node_modules/ethers') || 
               warning.message.includes('node_modules/web3'))) {
            return;
          }
          // Use default for everything else
          warn(warning);
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            web3: ['web3', 'ethers'],
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        }
      }
    }
  };
});