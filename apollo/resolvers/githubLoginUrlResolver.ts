import { Context } from '../apolloServerContext';
import { QueryResolvers, Scope } from '../../graphql/generated/graphql-types';

export const githubLoginUrl: QueryResolvers<Context>['githubLoginUrl'] = (
  parent,
  { scope = [Scope.user] },
  context,
) => {
  const scopes = scope?.join(' ') ?? '';
  const url = `https://github.com/login/oauth/authorize?client_id=${
    process.env.CLIENT_ID
  }&scope=${encodeURIComponent(scopes)}`;

  return { url };
};
