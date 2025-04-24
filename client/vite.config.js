import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Check for environment variables
const isVercelDeployment = process.env.VITE_VERCEL_DEPLOYMENT === 'true';
const isFleekDeployment = process.env.VITE_FLEEK_DEPLOYMENT === 'true';
const isDevEnvironment = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'react-toastify',
      'framer-motion',
      'axios'
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        if (warning.message.includes('Use of eval')) {
          return;
        }
        // Use default for everything else
        warn(warning);
      },
      output: {
        // Prevent vendor chunk splitting, to avoid the issue where too many 
        // small chunks could crash the browser
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('web3.js') || id.includes('ethers') || id.includes('blockchain')) {
              return 'web3';
            }
            return 'vendor';
          }
        },
      },
    },
    // Generate sourcemaps 
    sourcemap: isDevEnvironment,
    // Don't minify in development mode
    minify: !isDevEnvironment,
  },
  define: {
    // Define global variables
    __IS_DEV__: isDevEnvironment,
    __VERCEL_DEPLOYMENT__: isVercelDeployment,
    __FLEEK_DEPLOYMENT__: isFleekDeployment,
  },
  // Development server configuration
  server: {
    // Allow hot module replacement
    hmr: true,
    // Open the browser automatically in development
    open: false,
    // Port to use - will auto increment if in use
    port: 5173,
    // Show overlay on errors
    overlay: true,
    // Configure proxy for development API calls
    proxy: isDevEnvironment ? {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        secure: false,
      }
    } : {}
  }
});