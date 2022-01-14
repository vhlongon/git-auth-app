import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { isValidJWT } from '../utils/jwtUtils';

const Profile = () => {
  return (
    <div>
      <h2>Profile page</h2>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { jwt } = context.req.cookies;
  const { jwtToken, accessToken } = JSON.parse(jwt || '{}');

  if (!isValidJWT(jwtToken, accessToken)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Profile;
