import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, LoginCredentials, RegisterData } from '@/types';
import { DEMO_USERS } from '@/data/mockUsers';
import { DEMO_ACCOUNTS } from '@/lib/constants';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isAuthority: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'aaraksh_demo_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const demoAccount = Object.values(DEMO_ACCOUNTS).find(
      a => a.email === credentials.email && a.password === credentials.password
    );

    if (!demoAccount) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password. Use demo credentials.' };
    }

    const matchedUser = DEMO_USERS.find(u => u.email === demoAccount.email);
    if (!matchedUser) {
      setIsLoading(false);
      return { success: false, error: 'User not found.' };
    }

    const sessionUser = { ...matchedUser, lastActive: new Date().toISOString() };
    setUser(sessionUser);
    if (credentials.rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    }
    setIsLoading(false);
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return { success: false, error: 'Passwords do not match.' };
    }

    const exists = DEMO_USERS.find(u => u.email === data.email);
    if (exists) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    // In demo mode, we create a temporary user session
    const newUser: User = {
      id: `USR_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: 'USER',
      preferredRegion: data.preferredRegion,
      preferredLocation: data.preferredLocation,
      isActive: true,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      avatarInitials: data.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };

    setUser(newUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    if (!user) return false;
    if (role === 'USER') return ['USER', 'AUTHORITY', 'ADMIN'].includes(user.role);
    if (role === 'AUTHORITY') return ['AUTHORITY', 'ADMIN'].includes(user.role);
    return user.role === 'ADMIN';
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isAuthority: user?.role === 'AUTHORITY' || user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
