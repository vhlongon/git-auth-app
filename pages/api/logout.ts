import { setServerCookie } from './../../utils/cookieUtils';
import type { NextApiRequest, NextApiResponse } from 'next';

export const logout = (req: NextApiRequest, res: NextApiResponse) => {
  setServerCookie(res, 'jwt', JSON.stringify({}), {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  });
  res.statusCode = 200;
  res.json({ success: true });
};

export default logout;
