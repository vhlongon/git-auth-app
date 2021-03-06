import { MutationResolvers } from '../../graphql/generated/graphql-types';
import { AuthPayloadUser, Credentials } from '../../types';
import { requestGithubToken } from './getGithubAccessTokenResolver';
import camelCase from 'camelcase-keys';
import { setHeadersWithAuthorization } from '../../utils/authUtils';

export const requestGithubUserAccount = async (
  token: string,
): Promise<AuthPayloadUser> => {
  const res = await fetch(`${process.env.RESOURCE_ENDPOINT}/user`, {
    headers: setHeadersWithAuthorization(token, { Accept: '/*' }),
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
  async (_parent, { code }) => {
    try {
      const credentials = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
      };
      const { user, accessToken } = await requestGithubUser(credentials);

      return { user: camelCase(user), accessToken };
    } catch (error) {
      return null;
    }
  };
