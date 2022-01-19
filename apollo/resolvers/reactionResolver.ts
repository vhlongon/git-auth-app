import { CommentResolvers } from './../../graphql/generated/graphql-types';
import { Context } from '../apolloServerContext';

export const reactionResolver: CommentResolvers<Context>['reactions'] = async (
  parent,
  _args,
  context,
) => {
  if (!context.accessToken) {
    return null;
  }

  return parent.reactions ?? null;
};
