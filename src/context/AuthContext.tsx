import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Teacher } from '../types';

interface AuthContextType {
  profile: UserProfile | null;
  isPrincipal: boolean;
  isAuthenticated: boolean;
  loginAs: (role: 'principal' | 'teacher', teacher?: Teacher) => void;
  logout: () => void;
  isSwitchModalOpen: boolean;
  setIsSwitchModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRINCIPAL_PROFILE: UserProfile = {
  id: 'principal-01',
  name: 'Dr. Rajeshwar Sharma',
  email: 'principal@schoolsmarthub.edu',
  role: 'principal',
  designation: 'Principal & Academic Director',
  department: 'Administration',
};

const DEFAULT_TEACHER_PROFILE: UserProfile = {
  id: 'tch-01',
  name: 'Mrs. Sunita Deshmukh',
  email: 's.deshmukh@schoolsmarthub.edu',
  role: 'teacher',
  designation: 'Senior Faculty - Mathematics',
  department: 'Mathematics',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('school_hub_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading stored user profile:', e);
    }
    // Default to Principal so admin features are readily observable
    return PRINCIPAL_PROFILE;
  });

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('school_hub_auth_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('school_hub_auth_user');
    }
  }, [profile]);

  const loginAs = (role: 'principal' | 'teacher', teacher?: Teacher) => {
    if (role === 'principal') {
      setProfile(PRINCIPAL_PROFILE);
    } else if (teacher) {
      setProfile({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        designation: teacher.designation,
        department: teacher.department,
      });
    } else {
      setProfile(DEFAULT_TEACHER_PROFILE);
    }
    setIsSwitchModalOpen(false);
  };

  const logout = () => {
    // When logging out, we can switch to logged out state or offer quick re-login
    setIsSwitchModalOpen(true);
  };

  const isPrincipal = profile?.role === 'principal';
  const isAuthenticated = !!profile;

  return (
    <AuthContext.Provider
      value={{
        profile,
        isPrincipal,
        isAuthenticated,
        loginAs,
        logout,
        isSwitchModalOpen,
        setIsSwitchModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
