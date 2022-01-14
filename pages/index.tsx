import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import { client } from '../apollo/client';

const Home: NextPage = () => {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Githug Login auth app</title>
        <meta
          name="description"
          content="github login auth app created with next app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </ApolloProvider>
  );
};

export default Home;
