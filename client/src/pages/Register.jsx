import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { ethers } from 'ethers';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profile: {
      fullName: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isMetaMaskUnlocked, setIsMetaMaskUnlocked] = useState(false);
  const [bypassMetaMask, setBypassMetaMask] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Override console methods to capture output
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    
    console.error = (...args) => {
      setConsoleOutput(prev => [...prev, {type: 'error', message: args.join(' ')}]);
      originalConsoleError.apply(console, args);
    };
    
    console.log = (...args) => {
      setConsoleOutput(prev => [...prev, {type: 'log', message: args.join(' ')}]);
      originalConsoleLog.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
    };
  }, []);

  useEffect(() => {
    checkMetaMaskStatus();
    // Add event listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkMetaMaskStatus = async () => {
    try {
      // Check if MetaMask is installed
      const isInstalled = typeof window.ethereum !== 'undefined';
      setIsMetaMaskInstalled(isInstalled);

      if (isInstalled) {
        // Check if MetaMask is unlocked by attempting to get accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsMetaMaskUnlocked(accounts && accounts.length > 0);
      }
    } catch (error) {
      console.error('Error checking MetaMask status:', error);
      setIsMetaMaskUnlocked(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    setIsMetaMaskUnlocked(accounts && accounts.length > 0);
  };

  const connectMetaMask = async () => {
    try {
      if (!isMetaMaskInstalled) {
        throw new Error('Please install MetaMask to use this application');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      setIsMetaMaskUnlocked(true);
      return accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Please connect your MetaMask wallet to continue.');
      } else if (error.message.includes('user rejected')) {
        throw new Error('You rejected the connection request. Please try again.');
      }
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields like profile.fullName
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!formData.profile.fullName) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    console.log('Starting registration process...');

    try {
      let walletAddress = null;
      let publicKey = null;

      // Try to connect MetaMask if available and not bypassed
      if (isMetaMaskInstalled && !bypassMetaMask) {
        try {
          // Connect or get current MetaMask account
          walletAddress = await connectMetaMask();
          
          // Create Web3 provider using window.ethereum
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Get the signer
          const signer = provider.getSigner();
          publicKey = await signer.getAddress();
          
          console.log('Successfully connected to MetaMask', { walletAddress, publicKey });
        } catch (metaMaskError) {
          console.error('MetaMask connection error:', metaMaskError);
          // If MetaMask connection fails, we'll proceed without wallet
          setError('MetaMask connection failed. Please try again or check your MetaMask settings.');
          setLoading(false);
          return;
        }
      } else {
        console.log('MetaMask not installed or bypassed, proceeding without wallet connection');
      }

      // Prepare registration data
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: {
          fullName: formData.profile.fullName
        }
      };

      // Add wallet info if available
      if (walletAddress && publicKey) {
        registrationData.walletAddress = walletAddress;
        registrationData.publicKey = publicKey;
      }
      
      console.log('Sending registration data:', registrationData);

      // Register user
      await register(registrationData);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          {!isMetaMaskInstalled && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2, width: '100%' }}>
              Please install MetaMask to use this application. 
              <Button 
                component="a" 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
              >
                Install MetaMask
              </Button>
            </Alert>
          )}

          {isMetaMaskInstalled && !isMetaMaskUnlocked && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2, width: '100%' }}>
              Please unlock your MetaMask wallet and connect it to continue
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="profile.fullName"
                  autoComplete="name"
                  value={formData.profile.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  name="role"
                  label="Role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="healthcare_provider">Healthcare Provider</MenuItem>
                  <MenuItem value="insurance_provider">Insurance Provider</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bypassMetaMask}
                      onChange={(e) => setBypassMetaMask(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Skip MetaMask wallet connection (testing only)"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || (!isMetaMaskInstalled && !bypassMetaMask) || (!isMetaMaskUnlocked && !bypassMetaMask)}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            {isMetaMaskInstalled && !isMetaMaskUnlocked && (
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={connectMetaMask}
              >
                Connect MetaMask
              </Button>
            )}

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/test-register`,
                    {
                      username: formData.username,
                      email: formData.email,
                      password: formData.password,
                      role: formData.role
                    }
                  );
                  console.log('Test registration response:', response.data);
                  localStorage.setItem('token', response.data.token);
                  localStorage.setItem('user', JSON.stringify(response.data.user));
                  toast.success('Test registration successful!');
                  navigate('/dashboard');
                } catch (error) {
                  console.error('Test registration error:', error);
                  setError(error.message || 'Test registration failed');
                } finally {
                  setLoading(false);
                }
              }}
            >
              Test Registration (Debug)
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        {/* Debug Console Output */}
        {consoleOutput.length > 0 && (
          <Paper elevation={3} sx={{ mt: 4, p: 2, width: '100%', maxHeight: '300px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>Debug Console</Typography>
            {consoleOutput.map((entry, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 1, 
                  color: entry.type === 'error' ? 'error.main' : 'text.primary',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                [{entry.type}] {entry.message}
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Register; 