import camelCase from 'camelcase-keys';
import {
  DeleteCommentMutationVariables,
  MutationResolvers,
} from './../../graphql/generated/graphql-types';
import { CommentPayload } from './commentResolver';

const deleteComment = async (
  args: DeleteCommentMutationVariables & { owner: string },
  token: string,
): Promise<Omit<CommentPayload, 'reactions'>> => {
  const { repoName, id, owner } = args;
  const body = {
    repoName,
    comment_id: id,
  };
  const url = `${process.env.RESOURCE_ENDPOINT}/repos/${owner}/${repoName}/issues/comments/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('error deleteComent', res);
    throw new Error(`Failed to delete comment: ${res.statusText}`);
  }

  return res.json();
};
export const deletCommentResolver: MutationResolvers['deleteComment'] = async (
  parent,
  args,
  context,
) => {
  const accessToken = context.accessToken;

  if (!accessToken) {
    return false;
  }
  try {
    await deleteComment(
      {
        ...args,
        owner: context.user?.login,
      },
      accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};
