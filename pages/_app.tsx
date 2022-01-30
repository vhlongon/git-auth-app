import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { AuthProvider, getAuthState } from '../providers/AuthProvider';
import Header from '../components/Header';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useProgressbar } from '../hooks/useProgressbar';
import '../public/nprogress.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const authSession = getAuthState(pageProps.cookie);
  const router = useRouter();
  const isStartPage = router.pathname === '/';
  const isLoginPage = router.pathname === '/login';

  const logOut = useCallback(() => {
    fetch('/api/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    if (!authSession.isLoggedIn) {
      router.push('/login');
    }
  }, [authSession.isLoggedIn, router, isLoginPage, isStartPage]);

  useProgressbar();

  return (
    <ApolloProvider client={client}>
      <AuthProvider
        isLoggedIn={authSession.isLoggedIn}
        user={authSession.user}
        logOut={logOut}>
        <div className="bg-amber-50 flex flex-1  flex-col h-screen text-gray-500">
          <Header isLoggedIn={authSession.isLoggedIn} />
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
