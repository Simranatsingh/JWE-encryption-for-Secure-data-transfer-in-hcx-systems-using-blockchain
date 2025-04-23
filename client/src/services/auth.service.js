import supabase from '../utils/supabase';
import { toast } from 'react-toastify';

// Register a new user
export const register = async (userData) => {
  try {
    // Create user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (authError) throw authError;

    // Create profile in users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'patient',
        profile: userData.profile || {},
        encryption_keys: {}
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: profileData, success: true };
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    // Store session in localStorage
    localStorage.setItem('authToken', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(profileData));

    return { user: profileData, success: true };
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Logout user
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    toast.error(error.message);
    return { error: error.message, success: false };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    // Check for session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { user: null, success: false };
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    
    return { user: profileData, success: true };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, success: false };
  }
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
}; 