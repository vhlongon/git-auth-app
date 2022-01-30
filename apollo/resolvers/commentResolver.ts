import {
  AuthorAssociation,
  Comment,
  IssueResolvers,
  Reactions,
} from './../../graphql/generated/graphql-types';
import { Context } from '../apolloServerContext';
import { AuthPayloadUser } from '../../types';
import camelCase from 'camelcase-keys';
import { setHeadersWithAuthorization } from '../../utils/authUtils';

export type ReactionPayload = {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
};

export type CommentPayload = {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: AuthPayloadUser;
  issue_url: string;
  author_association: AuthorAssociation;
  url: string;
  html_url: string;
  reactions?: ReactionPayload;
};

export const getComments = async (
  token: string,
  url: string,
): Promise<CommentPayload[] | null> => {
  const res = await fetch(url, {
    headers: setHeadersWithAuthorization(token, { Accept: '/*' }),
  });

  if (!res.ok) {
    console.error('error getComments', res);
    throw new Error(
      `Failed to fetch github user repo issue comments: ${res.statusText}`,
    );
  }

  return res.json();
};

const transformReactions = (
  reactions?: ReactionPayload | null,
): Reactions | null => {
  if (reactions && Object.keys(reactions).length > 0) {
    const { '+1': upVote, '-1': downVote, url, ...rest } = reactions;

    const propOrZero = Object.entries(rest).reduce<Reactions>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value || 0,
      }),
      {} as Reactions,
    );
    return {
      ...camelCase(propOrZero),
      url,
      upVote: upVote || 0,
      downVote: downVote || 0,
    };
  }

  return null;
};

export const transformComments = (
  comments: CommentPayload[] | null,
): Comment[] | [] => {
  if (comments && comments.length > 0) {
    return comments.map(comment => ({
      ...camelCase(comment),
      reactions: transformReactions(comment.reactions),
      user: camelCase(comment.user),
    }));
  }

  return [];
};

export const commentResolver: IssueResolvers<Context>['comments'] = async (
  parent,
  _args,
  context,
) => {
  if (!context.accessToken) {
    return null;
  }

  const comments = await getComments(context.accessToken, parent.commentsUrl);

  return transformComments(comments);
};
