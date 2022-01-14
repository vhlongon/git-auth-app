import { Context } from '../apolloServerContext';
import { QueryResolvers } from '../../graphql/generated/graphql-types';

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
