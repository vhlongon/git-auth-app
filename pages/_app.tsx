import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { AuthProvider } from '../providers/AuthProvider';
import Header from '../components/Header';
import { NextPageContext } from 'next';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider initialCookie={pageProps.cookie}>
        <div className="bg-amber-50 flex flex-1  flex-col h-screen text-gray-500">
          <Header />
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
};

type AppContext = {
  ctx: NextPageContext;
  Component: {
    getServerSideProps: (ctx: NextPageContext) => Promise<{ props: AppProps }>;
  };
};

MyApp.getInitialProps = async (appctx: AppContext) => {
  const { ctx, Component } = appctx;
  const appProps = { showActions: false, cookie: '' };

  if (typeof window === 'undefined' && ctx.req?.headers?.cookie) {
    appProps.cookie = ctx.req.headers.cookie;
  }

  if (Component.getServerSideProps) {
    Object.assign(appProps, await Component.getServerSideProps(ctx));
  }

  return { pageProps: { ...appProps } };
};

export default MyApp;
