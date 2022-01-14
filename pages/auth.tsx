import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../apollo/client';
import {
  AuthorizeWithGitHubMutation,
  AuthorizeWithGitHubMutationVariables,
  GetGithubAccessTokenMutation,
  GetGithubAccessTokenMutationVariables,
  GetMeQueryHookResult,
  User,
} from '../graphql/generated/graphql-types';
import authorizeWithGithub from '../graphql/mutations/authorizeWithGithub.graphql';

interface Props {
  accessToken?: string;
  user?: User;
}
const Auth = ({ user, accessToken }: Props) => {
  return (
    <div>
      <h1>Auth redirect page - no code provided</h1>
      {accessToken && <p>accessToken: {accessToken}</p>}
      {user && <p>user: {user.name}</p>}
    </div>
  );
};

export default Auth;

interface Params {
  code?: string;
}

export const getServerSideProps: GetServerSideProps<Params> = async context => {
  const { code } = context.query;

  if (typeof code === 'string') {
    const { data } = await client.mutate<
      AuthorizeWithGitHubMutation,
      AuthorizeWithGitHubMutationVariables
    >({
      mutation: authorizeWithGithub,
      variables: {
        code,
      },
    });

    return {
      props: {
        accessToken: data?.authorizeWithGithub.accessToken ?? '',
        user: data?.authorizeWithGithub.user ?? '',
      },
    };
  }

  return {
    props: {
      accessToken: '',
      user: '',
    },
  };
};
