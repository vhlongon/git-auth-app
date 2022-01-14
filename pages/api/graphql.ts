import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ApolloServerContext, Context } from '../../graphql/context/apolloServerContext';
import { Resolvers, User } from '../../graphql/generated/graphql-types';
import { authorizeWithGithubResolver } from '../../graphql/resolvers/authorizeWithGithubResolver';
import { getGithubAccessTokenResolver } from '../../graphql/resolvers/getGithubAccessTokenResolver';
import { githubLoginUrl } from '../../graphql/resolvers/githubLoginUrlResolver';
import { meResolver } from '../../graphql/resolvers/meResolver';
import { reposResolver } from '../../graphql/resolvers/reposResolver';
import typeDefs from '../../graphql/schema.graphql';



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

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ApolloServerContext,
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
