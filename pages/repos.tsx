import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../apollo/client';
import {
  GetMeQuery,
  GetMeQueryVariables,
  useGetReposQuery,
} from '../graphql/generated/graphql-types';
import { setHeadersWithAuthorization } from '../utils/authUtils';
import { getServerAuthToken } from '../utils/cookieUtils';
import meQuery from '../graphql/queries/me.graphql';
import Button from '../components/Button';
import { isValidJWT } from '../utils/jwtUtils';

const Repos = ({ totalRepos }: { totalRepos: number }) => {
  const { data, fetchMore, loading, networkStatus } = useGetReposQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      page: 0,
      perPage: 10,
    },
  });

  if (!data && loading) {
    return (
      <div className="flex flex-1 items-center justify-center">loading...</div>
    );
  }

  if (!data?.repos) {
    return (
      <div className="flex flex-1 items-center justify-center">
        No repos data
      </div>
    );
  }

  const allLoaded = data.repos.length === totalRepos;
  const currentPage = Math.floor(
    data.repos?.length ? data.repos?.length / 10 + 1 : 1,
  );

  return (
    <div className="flex-col items-center justify-center bg-amber-50 p-4">
      <ul className="max-w-xs mx-auto my-4">
        {data.repos.map(repo => (
          <li className="flex" key={repo.name}>
            <a target="_blank" rel="noreferrer" href={repo.htmlUrl}>
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Button
          disabled={allLoaded || loading}
          onClick={() =>
            fetchMore({
              variables: {
                page: currentPage,
                perPage: 10,
              },
            })
          }>
          {loading ? 'Loading more' : allLoaded ? 'All loaded' : 'Load more'}
        </Button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { jwtToken, accessToken } = getServerAuthToken(context);
  if (!isValidJWT(jwtToken, accessToken)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { data: meData } = await client.query<GetMeQuery, GetMeQueryVariables>({
    query: meQuery,
    context: {
      headers: setHeadersWithAuthorization(accessToken),
    },
  });

  return {
    props: { totalRepos: meData.me?.publicRepos },
  };
};

export default Repos;
