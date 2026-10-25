import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginWithDemo: (role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone: string; role: UserRole; region: string }) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: 'farmer',
  isAuthenticated: false,
  loginWithDemo: async () => {},
  login: async () => false,
  register: async () => false,
  logout: () => {},
  error: null,
  loading: false,
});

const defaultFarmer: User = {
  id: 'usr-farmer-1',
  name: 'Ramesh Patel',
  email: 'farmer@agritech.org',
  phone: '+91 98250 14820',
  role: 'farmer',
  region: 'Indore, Madhya Pradesh',
  farmSizeAcres: 12.5,
  primaryCrops: ['Soybean', 'Wheat', 'Chickpea'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultFarmer);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agritech_token') || 'demo_farmer_token');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If token exists, verify with backend or keep active session
    const savedToken = localStorage.getItem('agritech_token');
    const savedUser = localStorage.getItem('agritech_user');
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        setUser(defaultFarmer);
      }
    }
  }, []);

  const loginWithDemo = async (targetRole: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoRole: targetRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('agritech_token', data.token);
        localStorage.setItem('agritech_user', JSON.stringify(data.user));
      } else {
        // Fallback demo assignment
        const fallbackUsers: Record<UserRole, User> = {
          farmer: defaultFarmer,
          expert: {
            id: 'usr-expert-1',
            name: 'Dr. Sunita Deshmukh',
            email: 'expert@agritech.org',
            phone: '+91 94220 88310',
            role: 'expert',
            region: 'Central Agronomy Institute',
            specialization: 'Soil Chemistry & Plant Pathology',
          },
          admin: {
            id: 'usr-admin-1',
            name: 'Admin Coordinator',
            email: 'admin@agritech.org',
            phone: '+91 98111 22334',
            role: 'admin',
            region: 'AgriTech Central Command',
          },
        };
        setUser(fallbackUsers[targetRole]);
        setToken(`mock_token_${targetRole}`);
      }
    } catch {
      // offline fallback
      const fallbackUsers: Record<UserRole, User> = {
        farmer: defaultFarmer,
        expert: {
          id: 'usr-expert-1',
          name: 'Dr. Sunita Deshmukh',
          email: 'expert@agritech.org',
          phone: '+91 94220 88310',
          role: 'expert',
          region: 'Central Agronomy Institute',
          specialization: 'Soil Chemistry & Plant Pathology',
        },
        admin: {
          id: 'usr-admin-1',
          name: 'Admin Coordinator',
          email: 'admin@agritech.org',
          phone: '+91 98111 22334',
          role: 'admin',
          region: 'AgriTech Central Command',
        },
      };
      setUser(fallbackUsers[targetRole]);
      setToken(`mock_token_${targetRole}`);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('agritech_token', data.token);
        localStorage.setItem('agritech_user', JSON.stringify(data.user));
        return true;
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'Network connection issue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone: string; role: UserRole; region: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('agritech_token', result.token);
        localStorage.setItem('agritech_user', JSON.stringify(result.user));
        return true;
      } else {
        setError(result.error || 'Registration failed');
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'farmer',
        isAuthenticated: !!user,
        loginWithDemo,
        login,
        register,
        logout,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
