import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../apollo/client';
import {
  AuthorizeWithGitHubMutation,
  AuthorizeWithGitHubMutationVariables,
  User,
} from '../graphql/generated/graphql-types';
import authorizeWithGithub from '../graphql/mutations/authorizeWithGithub.graphql';
import { redirectNonAuthenticated } from '../utils/authUtils';
import { getServerAuthToken, setServerCookie } from '../utils/cookieUtils';
import { encodeJWT } from '../utils/jwtUtils';

interface Props {
  user?: User;
  jwtToken?: string;
  error?: string;
}

const Auth = ({ user, jwtToken, error }: Props) => {
  if (error) {
    return <div>something went wrong: {error}</div>;
  }

  return (
    <div>
      <h1>Auth page</h1>
      {user?.accessToken && <p>accessToken: {user.accessToken}</p>}
      {user?.name && <p>user: {user.name}</p>}
      {jwtToken && <p>jwtToken: {jwtToken}</p>}
    </div>
  );
};

export default Auth;

interface Params {
  code?: string;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { code } = context.query;

  if (typeof code === 'string') {
    const { jwtToken, accessToken } = getServerAuthToken(context);
    redirectNonAuthenticated(jwtToken, accessToken);

    try {
      const { data } = await client.mutate<
        AuthorizeWithGitHubMutation,
        AuthorizeWithGitHubMutationVariables
      >({
        mutation: authorizeWithGithub,
        variables: {
          code,
        },
      });

      if (data) {
        const { user, accessToken } = data.authorizeWithGithub;
        const userWithAccessToken = { ...user, accessToken };
        const jwtToken = encodeJWT(userWithAccessToken, accessToken);

        setServerCookie(
          context.res,
          'jwt',
          JSON.stringify({ jwtToken, accessToken }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60,
            sameSite: 'strict',
            path: '/',
          },
        );

        return {
          redirect: {
            destination: '/profile',
            permanent: false,
          },
        };
      }
    } catch (error) {
      return {
        props: {
          error: (error as string)?.toString() ?? 'an error occurred',
        },
      };
    }
  }

  return {
    props: {},
  };
};
