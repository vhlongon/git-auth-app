import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../apollo/client';
import {
  GetGithubLoginQuery,
  GetGithubLoginQueryVariables,
  Scope,
  useGetGithubLoginQuery,
} from '../graphql/generated/graphql-types';
import getGithubLoginUrl from '../graphql/queries/githubLoginUrl.graphql';

interface Props {
  loginUrl: string;
}

const Login = ({ loginUrl }: Props) => {
  return <a href={loginUrl}>Login with github</a>;
};

export default Login;

export const getServerSideProps: GetServerSideProps = async context => {
  const { data } = await client.query<
    GetGithubLoginQuery,
    GetGithubLoginQueryVariables
  >({
    query: getGithubLoginUrl,
    variables: {
      scope: [Scope.user, Scope.public_repo],
    },
  });

  return {
    props: {
      loginUrl: data.githubLoginUrl.url,
    },
  };
};
