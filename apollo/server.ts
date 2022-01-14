import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { Resolvers } from '../graphql/generated/graphql-types';
import { ApolloServerContext, Context } from './apolloServerContext';
import { authorizeWithGithubResolver } from './resolvers/authorizeWithGithubResolver';
import { getGithubAccessTokenResolver } from './resolvers/getGithubAccessTokenResolver';
import { githubLoginUrl } from './resolvers/githubLoginUrlResolver';
import { meResolver } from './resolvers/meResolver';
import { reposResolver } from './resolvers/reposResolver';
import typeDefs from '../graphql/schema.graphql';

const resolvers: Resolvers<Context> = {
  Query: {
    me: meResolver,
    githubLoginUrl: githubLoginUrl,
    repos: reposResolver,
  },
  Mutation: {
    authorizeWithGithub: authorizeWithGithubResolver,
    getGithubAccessToken: getGithubAccessTokenResolver,
  },
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ApolloServerContext,
});
