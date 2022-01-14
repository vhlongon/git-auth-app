import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../providers/AuthProvider';

const Header = () => {
  const { isLoggedIn, user, logOut } = useAuth();
  const router = useRouter();

  return (
    <header>
      {isLoggedIn ? (
        <>
          <h1>Logged-in as: {user?.name}</h1>
          <button onClick={() => logOut()}>Click here to log-out</button>
        </>
      ) : (
        <>
          <h1>You are not logged-in</h1>
          <button onClick={() => router.push('/login')}>
            Click to login-in with github
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
