import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { full_name: string; email: string; password: string; confirm_password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.me();
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login({ email, password });
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: { full_name: string; email: string; password: string; confirm_password: string }) => {
    const response = await api.register(payload);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('crisisguard_token');
        sessionStorage.removeItem('crisisguard_consultation_token');
      } catch {
        // Browser storage may be unavailable in private modes.
      }
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    setUser,
  }), [loading, login, logout, refreshUser, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
