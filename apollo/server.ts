import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { Resolvers } from '../graphql/generated/graphql-types';
import typeDefs from '../graphql/schema.graphql';
import { ApolloServerContext, Context } from './apolloServerContext';
import { authorizeWithGithubResolver } from './resolvers/authorizeWithGithubResolver';
import { commentResolver } from './resolvers/commentResolver';
import { commentsResolver } from './resolvers/commentsResolver';
import { createCommentResolver } from './resolvers/createCommentResolver';
import { deletCommentResolver } from './resolvers/deleteCommentResolver';
import { getGithubAccessTokenResolver } from './resolvers/getGithubAccessTokenResolver';
import { githubLoginUrl } from './resolvers/githubLoginUrlResolver';
import { issueResolver } from './resolvers/IssueResolver';
import { meResolver } from './resolvers/meResolver';
import { reactionResolver } from './resolvers/reactionResolver';
import { repoResolver } from './resolvers/repoResolver';
import { reposResolver } from './resolvers/reposResolver';

const resolvers: Resolvers<Context> = {
  Query: {
    me: meResolver,
    githubLoginUrl: githubLoginUrl,
    repos: reposResolver,
    repo: repoResolver,
    comments: commentsResolver,
  },
  Repo: {
    issues: issueResolver,
  },
  Issue: {
    comments: commentResolver,
  },
  Comment: {
    reactions: reactionResolver,
  },
  Mutation: {
    authorizeWithGithub: authorizeWithGithubResolver,
    getGithubAccessToken: getGithubAccessTokenResolver,
    createComment: createCommentResolver,
    deleteComment: deletCommentResolver,
  },
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ApolloServerContext,
});
