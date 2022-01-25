import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers, ...rest }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const createHttpLink = () => {
  return new HttpLink({
    uri:
      typeof window === 'undefined'
        ? `${process.env.BASE_URL}/api/graphql`
        : '/api/graphql',
    credentials: 'same-origin',
  });
};

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
  link: authLink.concat(createHttpLink()),
});
