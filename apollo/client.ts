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
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      Query: {
        fields: {
          repos: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  ssrMode: typeof window === 'undefined',
  link: authLink.concat(createHttpLink()),
});
