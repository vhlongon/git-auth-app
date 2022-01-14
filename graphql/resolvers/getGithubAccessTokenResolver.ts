import { Credentials } from '../../types';
import { MutationResolvers } from '../generated/graphql-types';

export const requestGithubToken = async (
  credentials: Credentials,
): Promise<{
  access_token: string;
}> => {
  console.log({ credentials });
  const res = await fetch(process.env.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    console.error('error requestGithubToken', res);
    throw new Error(`Failed to fetch github token: ${res.statusText}`);
  }

  return res.json();
};

export const getGithubAccessTokenResolver: MutationResolvers['getGithubAccessToken'] =
  async (parent, { code }) => {
    const { access_token } = await requestGithubToken({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    return { accessToken: access_token };
  };
