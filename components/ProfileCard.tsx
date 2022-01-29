import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { User } from '../graphql/generated/graphql-types';

const ItemLabel: React.FC<{}> = ({ children }) => (
  <span className="w-24 px-2 py-2 text-gray-400 font-semibold">{children}</span>
);

const Item: React.FC<{}> = ({ children }) => (
  <span className="text-slate-500 px-2 py-2 flex-1">{children}</span>
);

const ProfileCard = ({
  avatarUrl,
  name,
  login,
  followers,
  email,
  location,
}: User) => {
  return (
    <div className="bg-amber-50 shadow-md rounded-md p-4">
      {avatarUrl && (
        <div className="flex justify-center mb-4">
          <Image
            className="rounded-full"
            width="120"
            height="120"
            src={avatarUrl}
            alt={name || login}
          />
        </div>
      )}
      <h2 className="text-center text-xl text-gray-600 font-semibold leading-8">
        {name || login}
      </h2>
      <div className="flex flex-col items-center rounded p-4">
        <div className="flex flex-col items mt-4">
          <div className="flex justify-between">
            <ItemLabel>Location:</ItemLabel>
            <Item> {location}</Item>
          </div>
          <div className="flex  justify-between">
            <ItemLabel>Email:</ItemLabel>
            <Item> {email}</Item>
          </div>
          <div className="flex  justify-between">
            <ItemLabel>followers</ItemLabel>
            <Item> {followers || 0}</Item>
          </div>
        </div>

        <Link href="/repos" passHref>
          <a className="text-blue-500 mt-2 font-semibold hover:text-blue-700">
            View repos
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
