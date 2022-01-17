import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useAuth } from '../providers/AuthProvider';

const Home: NextPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Githug Login auth app</title>
        <meta
          name="description"
          content="github login auth app created with next app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col flex-1 items-center justify-center">
        <h2 className="text-2xl mb-6">Home page</h2>
        {isLoggedIn && (
          <Button onClick={() => router.push('/profile')}>Go to profile</Button>
        )}
      </div>
    </>
  );
};

export default Home;
