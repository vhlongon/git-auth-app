import { GetServerSideProps } from 'next';
import React from 'react';
import meQuery from '../graphql/queries/me.graphql';
import { client } from '../apollo/client';
import {
  GetMeQuery,
  GetMeQueryVariables,
} from '../graphql/generated/graphql-types';
import { setHeadersWithAuthorization } from '../utils/authUtils';
import { getServerAuthToken } from '../utils/cookieUtils';
import { isValidJWT } from '../utils/jwtUtils';
import ProfileCard from '../components/ProfileCard';

const Profile = ({ me }: GetMeQuery) => {
  if (!me) {
    return <div>No user data</div>;
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <ProfileCard {...me} />
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

  const { data } = await client.query<GetMeQuery, GetMeQueryVariables>({
    query: meQuery,
    context: {
      headers: setHeadersWithAuthorization(accessToken),
    },
  });

  return {
    props: {
      me: data.me,
    },
  };
};

export default Profile;
