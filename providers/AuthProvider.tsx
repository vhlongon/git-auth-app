import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCookie, setCookie } from 'react-use-cookie';
import { User } from '../graphql/generated/graphql-types';
import { decodeJWT, isValidJWT } from '../utils/jwtUtils';

interface AuthContextProps {
  isLoggedIn: boolean;
  user?: Pick<User, 'accessToken' | 'avatarUrl' | 'id' | 'login' | 'name'>;
  logOut: () => void;
}
export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  user: undefined,
  logOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const jwtCookie = getCookie('jwt');
  const { jwtToken, accessToken } = JSON.parse(jwtCookie || '{}');
  const validJWT = isValidJWT(jwtToken, accessToken);
  const [isLoggedIn, setIsLoggedIn] = useState(validJWT);
  const user = isLoggedIn ? decodeJWT(jwtToken) : undefined;

  useEffect(() => {
    if (window === undefined) {
      return;
    }

    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('user', JSON.stringify(user));
  }, [accessToken, user]);

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
    setCookie('jwt', '');
    window.localStorage.setItem('accessToken', '');
    window.localStorage.setItem('user', '');
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logOut }}>
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
