import { GetServerSidePropsContext } from 'next';
import { getServerAuthToken } from './cookieUtils';
import { isValidJWT } from './jwtUtils';

export const redirectNonAuthenticated = (
  jwtToken: string,
  accessToken: string,
) => {
  if (!isValidJWT(jwtToken, accessToken)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export const setAuthHeaders = (token: string) => {
  return { Authorization: `token ${token}` };
};
