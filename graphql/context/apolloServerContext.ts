import { NextApiRequest } from 'next';
import { transforUserResponse } from '../../utils/transformResponseData';
import { User } from '../generated/graphql-types';
import { requestGithubUserAccount } from '../resolvers/authorizeWithGithubResolver';

export type Context = {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
};

type State = {
  user: User | null;
  accessToken: string | null;
};

let current: State = {
  user: null,
  accessToken: null,
};

export const ApolloServerContext = async ({ req }: { req: NextApiRequest }) => {
  const authHeader = req.headers.authorization;
  const [, accessToken] = authHeader ? authHeader.split(' ') : [];

  if (current.user && accessToken === current.accessToken) {
    return {
      user: current.user,
      isLoggedIn: true,
      accessToken,
    };
  }

  if (!accessToken) {
    return { isLoggedIn: false, user: null, accessToken: null };
  }

  try {
    const user = await requestGithubUserAccount(accessToken);
    current.user = user;
    current.accessToken = accessToken;
    return { isLoggedIn: true, user: transforUserResponse(user), accessToken };
  } catch (error) {
    current.user = null;
    current.accessToken = null;
    return { isLoggedIn: false, user: null, accessToken: null };
  }
};
