import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { getCookie, setCookie } from 'react-use-cookie';
import { User } from '../graphql/generated/graphql-types';
import { parseCookie } from '../utils/cookies';
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
  initialCookie: string;
}

export const AuthProvider = ({
  children,
  initialCookie,
}: AuthProviderProps) => {
  const { jwt } = parseCookie(initialCookie) ?? {};
  const clientCookie = getCookie('jwt');
  const { jwtToken, accessToken } = JSON.parse(
    (jwt as string) || clientCookie || '{}',
  );

  const router = useRouter();
  const validJWT = isValidJWT(jwtToken, accessToken);
  const [isLoggedIn, setIsLoggedIn] = useState(validJWT);
  const user = isLoggedIn ? decodeJWT(jwtToken) : undefined;

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
    setCookie('jwt', '');
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
