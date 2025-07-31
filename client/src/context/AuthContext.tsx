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
  user: User|null;
  setUser: Dispatch<SetStateAction<User | null>>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
   console.log('user is',user)
  // Only fetch user if we don't have one and there's a token
  const shouldFetch = !user && getAccessToken();
  const { resourceData: fetchedUser } = useGet<User>(
    shouldFetch ? API_ROUTES.AUTH.ME : ''
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  // Fix: Pass an object to value prop, not comma-separated values
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  const{navigateToLogin} = useRoutes()
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
