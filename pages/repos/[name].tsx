import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { client } from '../../apollo/client';
import { setHeadersWithAuthorization } from '../../utils/authUtils';
import { getServerAuthToken } from '../../utils/cookieUtils';
import { isValidJWT } from '../../utils/jwtUtils';
import {
  GetRepoQuery,
  GetRepoQueryVariables,
  Repo,
} from '../../graphql/generated/graphql-types';
import repoQuery from '../../graphql/queries/repo.graphql';

const Repo = ({ repo }: { repo: Repo }) => {
  const router = useRouter();
  const { name } = router.query;

  return <p>Repo: {name}</p>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { jwtToken, accessToken } = getServerAuthToken(context);
  const repoName = context.params?.name;
  if (!isValidJWT(jwtToken, accessToken) || !repoName) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { data: repoData } = await client.query<
    GetRepoQuery,
    GetRepoQueryVariables
  >({
    query: repoQuery,
    variables: {
      name: repoName as string,
    },
    context: {
      headers: setHeadersWithAuthorization(accessToken),
    },
  });

  return {
    props: {
      repo: repoData.repo,
    },
  };
};

export default Repo;
