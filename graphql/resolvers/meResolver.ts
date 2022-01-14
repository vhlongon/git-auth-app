import { Context } from '../context/apolloServerContext';
import { QueryResolvers } from '../generated/graphql-types';

export const meResolver: QueryResolvers<Context>['me'] = (
  parent,
  args,
  context,
) => {
  if (!context.user) {
    return null;
  }

  return context.user;
};
