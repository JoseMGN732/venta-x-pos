import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { DEFAULT_BUSINESS_ID } from '../lib/constants';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  role: Role | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo, we check against DEMO_USERS or localStorage users of the current business
    // To keep it simple as requested:
    if (username === 'admin' && password === 'admin123') {
      const u: User = { id: 'user-admin', username: 'admin', nombre: 'Administrador Demo', rol: 'Administrador', negocioId: DEFAULT_BUSINESS_ID };
      setUser(u);
      localStorage.setItem('auth_user', JSON.stringify(u));
      return true;
    }
    if (username === 'cajero' && password === 'cajero123') {
      const u: User = { id: 'user-cajero', username: 'cajero', nombre: 'Cajero Demo', rol: 'Cajero', negocioId: DEFAULT_BUSINESS_ID };
      setUser(u);
      localStorage.setItem('auth_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      role: user?.rol || null 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
