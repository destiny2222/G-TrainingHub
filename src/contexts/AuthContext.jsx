import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountType, setAccountType] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const savedToken = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
      const savedAccountType = localStorage.getItem('accountType') || 
                               (localStorage.getItem('adminToken') ? 'admin' : null);


      //TODO: remove this after u solve api user profile issue
      const userData = localStorage.getItem('userData');
      const userDetails = userData ? JSON.parse(userData) : null;
      
      if (!savedToken || !savedAccountType) {
        setIsLoading(false);
        return;
      }

      // Set token in axios defaults
      // api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

      // Fetch user profile based on account type
      // let profileEndpoint;
      // if (savedAccountType === 'individual') {
      //   profileEndpoint = '/api/user/profile';
      // } else if (savedAccountType === 'organization') {
      //   profileEndpoint = '/api/organization/profile';
      // } else if (savedAccountType === 'admin') {
      //   profileEndpoint = '/api/admin/profile';
      // } else {
      //   throw new Error('Invalid account type');
      // }

      // const response = await api.get(profileEndpoint);
      
      setUser(userDetails);

      // setUser(response.data.user);
      // setOrganizations(response.data.organizations || []);
      setToken(savedToken);
      setAccountType(savedAccountType);
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('accountType');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  // Clear auth state
  const clearAuth = () => {
    setUser(null);
    setOrganizations([]);
    setToken(null);
    setIsAuthenticated(false);
    setAccountType(null);
    setError(null);
  };

  // Set auth state
  const setAuth = (userData, token, accountType, organizations = []) => {
    setUser(userData);
    setOrganizations(organizations);
    setToken(token);
    setAccountType(accountType);
    setIsAuthenticated(true);
    setError(null);

    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('accountType', accountType);

    localStorage.setItem('userData', JSON.stringify(userData)); //TODO: remove this after u solve api user profile issue
    
    // For backward compatibility with admin routes
    if (accountType === 'admin') {
      localStorage.setItem('adminToken', token);
    }
    
    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Individual user login
  const loginIndividual = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/user/login', credentials);
      const { user, access_token, organizations } = response.data;

      setAuth(user, access_token, 'individual', organizations);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Organization user login
  const loginOrganization = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/organization/login', credentials);
      const { user, access_token, organizations } = response.data;
      

      setAuth(user, access_token, 'organization', organizations);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login
  const loginAdmin = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/admin/login', credentials);
      const { admin, token } = response.data;

      setAuth(admin, token, 'admin');

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call appropriate logout endpoint
      if (accountType === 'individual') {
        await api.post('/user/logout');
      } else if (accountType === 'organization') {
        await api.post('/organization/logout');
      } else if (accountType === 'admin') {
        await api.post('/admin/logout');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear everything regardless of API call result
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('adminToken');
      // localStorage.removeItem('accountType');
      // localStorage.removeItem('userData');
      localStorage.clear();
      sessionStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      clearAuth();
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user || accountType === 'individual') return false;
    if (accountType === 'admin') return true;
    return user.roles && Object.values(user.roles).includes(role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return accountType === 'admin' || user?.is_admin === true;
  };

  // Check if user belongs to specific organization
  const belongsToOrganization = (organizationId) => {
    if (!organizations) return false;
    return organizations.some(org => org.id === organizationId);
  };

  const value = {
    user,
    organizations,
    token,
    isAuthenticated,
    isLoading,
    error,
    accountType,
    loginIndividual,
    loginOrganization,
    loginAdmin,
    logout,
    hasRole,
    isAdmin,
    belongsToOrganization,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;