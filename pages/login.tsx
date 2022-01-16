import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../apollo/client';
import GithubLogo from '../components/GithubLogo';
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
  return (
    <div className="flex items-center justify-center flex-1">
      <a
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-between w-60"
        href={loginUrl}>
        <span>Authorize with github</span>
        <GithubLogo />
      </a>
    </div>
  );
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
      apolloStaticCache: client.cache.extract(),
    },
  };
};
