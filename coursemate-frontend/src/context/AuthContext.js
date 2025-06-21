import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function that matches your backend API
  const login = async (token) => {
    localStorage.setItem('token', token);
    const user = decodeToken(token); // You'll need to implement this
    setCurrentUser(user);
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        email,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      const user = decodeToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Check auth state on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = decodeToken(token);
        setCurrentUser(user);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Helper function to decode JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return {
        email: payload.email,
        username: payload.username,  // Ensure this matches backend JWT claims
        token: token
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}