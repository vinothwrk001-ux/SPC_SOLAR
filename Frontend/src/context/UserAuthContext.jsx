import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('userToken');
      const cached = localStorage.getItem('userData');

      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          // ignore corrupted JSON
        }
      }

      if (token) {
        try {
          const { data } = await api.get('/user/me');
          setUser(data);
          localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
          // Token expired or invalid
          console.warn('User session invalid or expired:', error?.response?.data?.message);
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/user/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (data?.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        setUser(data);
        toast.success(`Welcome back, ${data.name || 'Solar Member'}! Prices unlocked.`);
        return { success: true, data };
      }
      throw new Error('No token returned');
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const { data } = await api.post('/user/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone ? phone.trim() : '',
      });

      if (data?.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        setUser(data);
        toast.success(`Account created! Welcome, ${data.name}!`);
        return { success: true, data };
      }
      throw new Error('No token returned');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout').catch(() => {});
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isUserLoggedIn: Boolean(user),
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContext;
