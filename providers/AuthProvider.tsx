import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { User } from '../graphql/generated/graphql-types';
import { parseCookie } from '../utils/cookieUtils';
import { decodeJWT, isValidJWT } from '../utils/jwtUtils';

type AuthSessionUser = Pick<
  User,
  'accessToken' | 'avatarUrl' | 'id' | 'login' | 'name'
>;
interface AuthContextProps {
  isLoggedIn: boolean;
  user?: AuthSessionUser;
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

const getAuthState = (
  cookie?: string,
): { isLoggedIn: boolean; user: AuthSessionUser | undefined } => {
  const { jwt } = parseCookie(cookie) ?? {};
  const parsedCookie = jwt ? JSON.parse(`${jwt}`) : {};
  const { jwtToken, accessToken } = parsedCookie;
  const validJWT = isValidJWT(jwtToken, accessToken);
  const user = validJWT ? decodeJWT<AuthSessionUser>(jwtToken) : undefined;

  return { isLoggedIn: validJWT, user };
};

export const AuthProvider = ({
  children,
  initialCookie,
}: AuthProviderProps) => {
  const authSession = getAuthState(initialCookie);
  const [isLoggedIn, setIsLoggedIn] = useState(authSession.isLoggedIn);
  const [user, setUser] = useState<AuthSessionUser | undefined>(
    authSession.user,
  );
  const router = useRouter();

  const logOut = useCallback(() => {
    setIsLoggedIn(false);
    setUser(undefined);
    fetch('/api/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
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
