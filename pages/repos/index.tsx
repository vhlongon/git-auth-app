import { GetServerSideProps } from 'next';
import React from 'react';
import { client } from '../../apollo/client';
import {
  GetMeQuery,
  GetMeQueryVariables,
  GetReposQuery,
  GetReposQueryVariables,
  useGetReposQuery,
} from '../../graphql/generated/graphql-types';
import { setHeadersWithAuthorization } from '../../utils/authUtils';
import { getServerAuthToken } from '../../utils/cookieUtils';
import meQuery from '../../graphql/queries/me.graphql';
import reposQuery from '../../graphql/queries/repos.graphql';
import Button from '../../components/Button';
import { isValidJWT } from '../../utils/jwtUtils';
import Link from 'next/link';
import List from '../../components/List';
import Loading from '../../components/Loading';
import ArrowIcon from '../../components/ArrowIcon';

const Repos = ({ totalRepos }: { totalRepos: number }) => {
  const { data, fetchMore, loading } = useGetReposQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      page: 0,
      perPage: 10,
    },
  });

  if (!data && loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading size="100px" />
      </div>
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
    <div className="flex-col items-center justify-center bg-amber-50 py-4 px-10">
      <List
        items={data.repos}
        renderItem={({ name }) => {
          return (
            <Link href={`repos/${name}`} passHref>
              <a
                className="flex w-full p-2 justify-between"
                href={`repos/${name}`}>
                {name}
                <ArrowIcon />
              </a>
            </Link>
          );
        }}
        idProp="name"
      />
      <div className="flex justify-center items-center flex-col max-w-[140px] m-auto mt-4">
        {loading && <Loading size="60px" />}
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

  await client.query<GetReposQuery, GetReposQueryVariables>({
    query: reposQuery,
    context: {
      headers: setHeadersWithAuthorization(accessToken),
    },
  });

  return {
    props: { totalRepos: meData.me?.publicRepos },
  };
};

export default Repos;
