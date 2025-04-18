import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CpuArchitecture } from '../components/ui/cpu-architecture';
import { toast } from 'react-toastify';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: { 
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log('Login submitted:', formData);
      
      // For demo purposes - success after 1 second delay
      setTimeout(() => {
        // Demo user validation (replace with actual API call)
        if (formData.email && formData.password) {
          toast.success('Login successful!');
          // Save fake token to localStorage
          localStorage.setItem('authToken', 'demo-token-12345');
          navigate('/dashboard');
        } else {
          toast.error('Please fill in all fields');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl max-w-md w-full"
        variants={itemVariants}
      >
        <div className="flex justify-center mb-6">
          <CpuArchitecture width="64" height="64" text="LOG" />
        </div>
        
        <motion.h1 
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Login to Your Account
        </motion.h1>
        
        <motion.form variants={itemVariants} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 bg-blue-600 text-white rounded-lg font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </motion.form>
        
        <motion.p className="text-center mt-4 text-sm" variants={itemVariants}>
          Don't have an account? {' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login; 