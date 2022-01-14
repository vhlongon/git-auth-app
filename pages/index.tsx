import { ApolloProvider } from '@apollo/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { client } from '../apollo/client';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

const Home: NextPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Head>
          <title>Githug Login auth app</title>
          <meta
            name="description"
            content="github login auth app created with next app"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h2>Home page</h2>
        {isLoggedIn && (
          <button onClick={() => router.push('/profile')}>Go to profile</button>
        )}
      </AuthProvider>
    </ApolloProvider>
  );
};

export default Home;
