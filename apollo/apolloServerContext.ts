import { NextApiRequest } from 'next';
import { User } from '../graphql/generated/graphql-types';
import { requestGithubUserAccount } from './resolvers/authorizeWithGithubResolver';
import camelCase from 'camelcase-keys';

export type Context = {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
};

type State = {
  user: User | null;
  accessToken: string | null;
};

export const ApolloServerContext = async ({ req }: { req: NextApiRequest }) => {
  const authHeader = req.headers.authorization;
  const [, accessTokenFromHeader] = authHeader ? authHeader.split(' ') : [];
  const { accessToken: accessTokenFromCookies } = JSON.parse(
    req.cookies?.jwt ?? '{}',
  );

  const accessToken = accessTokenFromHeader || accessTokenFromCookies;

  if (!accessToken) {
    return { isLoggedIn: false, user: null, accessToken: null };
  }

  try {
    const user = await requestGithubUserAccount(accessToken);

    return { isLoggedIn: true, user: camelCase(user), accessToken };
  } catch (error) {
    return { isLoggedIn: false, user: null, accessToken: null };
  }
};
