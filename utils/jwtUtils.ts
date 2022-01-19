import { decode, sign, verify } from 'jsonwebtoken';

export const encodeJWT = (data: Record<string, unknown>, secret: string) => {
  const { accessToken, avatarUrl, id, login, name } = data;
  const jwtPayload = {
    login,
    id,
    avatarUrl,
    accessToken,
    name,
  };

  return sign(jwtPayload, secret, { expiresIn: '1h' });
};

export const decodeJWT = <T = Record<string, unknown>>(
  token: string,
): T | undefined => {
  const decodedData = (decode(token) as T) ?? undefined;
  return decodedData;
};

export const isValidJWT = (token: string, secret: string) => {
  try {
    verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};
