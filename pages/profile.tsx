import { GetServerSideProps } from 'next';
import React from 'react';
import meQuery from '../graphql/queries/me.graphql';
import { client } from '../apollo/client';
import {
  GetMeQuery,
  GetMeQueryVariables,
} from '../graphql/generated/graphql-types';
import Image from 'next/image';
import { redirectNonAuthenticated } from '../utils/authUtils';
import { getServerAuthToken } from '../utils/cookieUtils';

const Item: React.FC<{ element: keyof JSX.IntrinsicElements }> = ({
  children,
  element: Element,
}) => <Element className="text-slate-600">{children}</Element>;

const Profile = ({ me }: GetMeQuery) => {
  if (!me) {
    return <div>No user data</div>;
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1 className="h1 mb-4 font-semibold text-2xl">Profile page</h1>
      <div className="flex flex-col items-center border-4 border-amber-200 rounded p-8">
        {me.avatarUrl && (
          <Image
            className="rounded-full w-16 h-16"
            width="60"
            height="60"
            src={me.avatarUrl}
            alt={me.name || me.login}
          />
        )}
        <div className="flex flex-col items mt-4">
          <Item element="h2">Name: {me.name}</Item>
          <Item element="p">Location: {me.location}</Item>
          <Item element="p">Email: {me.email}</Item>
          <Item element="p">Followers: {me.followers}</Item>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { jwtToken, accessToken } = getServerAuthToken(context);
  redirectNonAuthenticated(jwtToken, accessToken);

  const { data } = await client.query<GetMeQuery, GetMeQueryVariables>({
    query: meQuery,
    context: {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    },
  });

  return {
    props: {
      me: data.me,
    },
  };
};

export default Profile;
