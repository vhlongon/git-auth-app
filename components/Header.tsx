import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import Button from './Button';

const Header = () => {
  const { isLoggedIn, user, logOut } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn) {
      logOut();
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="flex justify-between items-center p-4 border-b-amber-200 border-b-4 bg-amber-100 text-gray-500">
      <>
        <h1 className="font-bold text text-xl">
          {isLoggedIn ? `Logged-in as: ${user?.name}` : 'You are not logged-in'}
        </h1>
        <Button onClick={handleClick}>
          {isLoggedIn ? 'Log out' : 'Log in'}
        </Button>
      </>
    </header>
  );
};

export default Header;
