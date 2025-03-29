import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api';
import type { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};