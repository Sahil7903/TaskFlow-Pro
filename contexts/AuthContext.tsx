import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { getUsers, initializeStorage } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize LocalStorage data on app load
    initializeStorage();
    
    // Check if user was logged in previously (simple persistence via localStorage)
    const storedUser = localStorage.getItem('taskflow_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Mock credentials verification
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = { id: 999, username: 'admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('taskflow_current_user', JSON.stringify(adminUser));
      return true;
    }

    // Check against stored regular users
    const users = getUsers();
    const foundUser = users.find((u) => u.username === username);

    // Hardcoded password for all users for this prototype
    if (foundUser && password === 'user123') {
      setUser(foundUser);
      localStorage.setItem('taskflow_current_user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
