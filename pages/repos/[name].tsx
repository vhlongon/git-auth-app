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
  useGetCommentsLazyQuery,
} from '../../graphql/generated/graphql-types';
import repoQuery from '../../graphql/queries/repo.graphql';
import { useState } from 'react';
import Modal from '../../components/Modal';
import Comment from '../../components/Comments';
import Comments from '../../components/Comments';
import List from '../../components/List';
import EditIcon from '../../components/EditIcon';
import Loading from '../../components/Loading';

const Repo = ({ repo }: { repo: Repo }) => {
  const [modalOpen, setOpenModal] = useState(false);
  const [getComments, commentsData] = useGetCommentsLazyQuery();

  const router = useRouter();
  const { name } = router.query;

  if (!repo) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-3xl">Repo: {name}</h1>
        <p>No repo data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-10">
      <h1 className="text-5xl text-center mt-6">
        <a href={repo.htmlUrl}>{name}</a>
      </h1>
      {repo.issues && (
        <>
          <h2 className="text-gray-400 font-semibold mt-6">Issues:</h2>
          <List
            items={repo.issues}
            idProp="id"
            renderItem={({ number, title }) => (
              <button
                className="flex items-center justify-between w-full"
                onClick={() => {
                  getComments({
                    variables: {
                      number: number,
                      name: repo.name,
                    },
                  });
                  setOpenModal(true);
                }}>
                <div>
                  <span className="text-gray-400 font-semibold text mr-2">
                    {number}
                  </span>
                  <span className="text-slate-500 text-lg">{title}</span>
                </div>
                <EditIcon />
              </button>
            )}
          />
          <Modal isOpen={modalOpen} setModalOpen={setOpenModal}>
            {commentsData.loading && (
              <div className="flex justify-center mt-[140px]">
                <Loading />
              </div>
            )}
            {commentsData.error && <p>Error loading comments</p>}
            {commentsData.data && (
              <Comments comments={commentsData.data.comments} />
            )}
          </Modal>
        </>
      )}
    </div>
  );
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
