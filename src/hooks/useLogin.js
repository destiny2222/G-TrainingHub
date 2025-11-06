import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { loginIndividual, loginOrganization, loginAdmin, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const login = async (credentials, accountType = 'individual', redirectPath = null) => {
    let result;
    
    // Call appropriate login method
    if (accountType === 'individual') {
      result = await loginIndividual(credentials);
    } else if (accountType === 'organization') {
      result = await loginOrganization(credentials);
    } else if (accountType === 'admin') {
      result = await loginAdmin(credentials);
    } else {
      return { success: false, error: 'Invalid account type' };
    }

    // Handle successful login
    if (result.success && !redirectPath) {
      // Auto redirect based on account type
      if (accountType === 'individual') {
        navigate('/dashboard');
      } else if (accountType === 'organization') {
        navigate('/organization/dashboard');
      } else if (accountType === 'admin') {
        navigate('/admin/dashboard');
      }
    } else if (result.success && redirectPath) {
      navigate(redirectPath);
    }

    return result;
  };

  return {
    login,
    isLoading,
    error,
  };
};