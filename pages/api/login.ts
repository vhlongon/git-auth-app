import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export const login = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('jwt', req.body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      sameSite: 'strict',
      path: '/',
    }),
  );
  res.statusCode = 200;
  res.json({ success: true });
};

export default login;
