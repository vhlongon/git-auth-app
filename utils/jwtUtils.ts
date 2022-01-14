import { decode, sign, verify } from 'jsonwebtoken';
import { User } from '../graphql/generated/graphql-types';

type EncodeData = Pick<
  User,
  'accessToken' | 'avatarUrl' | 'id' | 'login' | 'name'
>;

export const encodeJWT = (data: EncodeData, secret: string) => {
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

export const decodeJWT = (token: string): EncodeData => {
  return decode(token) as EncodeData;
};

export const isValidJWT = (token: string, secret: string) => {
  try {
    verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};
