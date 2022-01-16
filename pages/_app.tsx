import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { AuthProvider } from '../providers/AuthProvider';
import Header from '../components/Header';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <div className="bg-amber-50 flex flex-1  flex-col h-screen text-gray-500">
          <Header />
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default MyApp;
