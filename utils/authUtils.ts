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

export const setHeadersWithAuthorization = (
  token: string,
  options: Record<string, string> = {},
) => {
  return { Authorization: `token ${token}`, ...options };
};
