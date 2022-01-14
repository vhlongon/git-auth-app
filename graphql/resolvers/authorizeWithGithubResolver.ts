import { AuthPayloadUser, Credentials } from '../../types';
import { transforUserResponse } from '../../utils/transformResponseData';
import { MutationResolvers } from '../generated/graphql-types';
import { requestGithubToken } from './getGithubAccessTokenResolver';

export const requestGithubUserAccount = async (
  token: string,
): Promise<AuthPayloadUser> => {
  const res = await fetch(`${process.env.RESOURCE_ENDPOINT}/user`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: '/*',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch github user account: ${res.statusText}`);
  }

  return res.json();
};

const requestGithubUser = async (credentials: Credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);

  return { user: githubUser, accessToken: access_token };
};

export const authorizeWithGithubResolver: MutationResolvers['authorizeWithGithub'] =
  async (parent, { code }) => {
    const { user, accessToken } = await requestGithubUser({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    return { user: transforUserResponse(user), accessToken };
  };
