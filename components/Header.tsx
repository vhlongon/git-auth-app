import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import Button from './Button';

const Header = () => {
  const { isLoggedIn, user, logOut } = useAuth();
  const router = useRouter();
  const isStart = router.pathname === '/';

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
        <div>
          {isLoggedIn && user ? (
            <div className="flex items-center">
              {user.avatarUrl && (
                <Image
                  className="rounded-full w-16 h-16"
                  width="30"
                  height="30"
                  src={user.avatarUrl}
                  alt={user.name}
                />
              )}
              <h2 className="font-bold text text-l ml-4">{user?.name}</h2>
            </div>
          ) : (
            <h2 className="font-bold text text-l">You are not logged-in</h2>
          )}
        </div>
        <div className="flex">
          {!isStart && (
            <Button
              className="mr-4"
              onClick={() => {
                router.push('/');
              }}>
              Back to start
            </Button>
          )}
          <Button onClick={handleClick}>
            {isLoggedIn ? 'Log out' : 'Log in'}
          </Button>
        </div>
      </>
    </header>
  );
};

export default Header;
