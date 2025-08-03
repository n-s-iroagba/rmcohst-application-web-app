'use client';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

import { API_ROUTES } from '@/config/routes';
import { User } from '@/types/auth.types';
import { getAccessToken } from '@/lib/apiUtils';
import { useGet } from '@/hooks/useApiQuery';
import { useRoutes } from '@/hooks/useRoutes';

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  error: string;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  console.log('user is', user);
  
  const shouldFetch = !user && getAccessToken();
  const { resourceData: fetchedUser, loading, error } = useGet<User>(
    shouldFetch ? API_ROUTES.AUTH.ME : ''
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);
  const defaultUser: User = {
    // Add your default user properties here based on your User type
    id: '',
    email: '',
    username: '',
    role:'applicant'
    // ... other required User properties
  };
  const returnUser = user||defaultUser

  return (
    <AuthContext.Provider value={{user:returnUser , setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  const { navigateToLogin } = useRoutes();
  
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  // Handle navigation in useEffect to avoid side effects during render
  useEffect(() => {
    if ((!context.loading && !context.user) || context.error) {
      navigateToLogin();
    }
  }, [context.loading, context.user, context.error, navigateToLogin]);

  // Return user if exists, otherwise return a default user object

  return context
    
  
};