import camelCase from 'camelcase-keys';
import {
  CreateCommentMutationVariables,
  MutationResolvers,
} from './../../graphql/generated/graphql-types';
import { CommentPayload } from './commentResolver';

const createComment = async (
  args: CreateCommentMutationVariables & { owner: string },
  token: string,
): Promise<Omit<CommentPayload, 'reactions'>> => {
  const { issueNumber, ...rest } = args;
  const body = {
    ...rest,
    issue_number: issueNumber,
  };
  const url = `${process.env.RESOURCE_ENDPOINT}/repos/${args.owner}/${args.repoName}/issues/${args.issueNumber}/comments`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('error createComment', res);
    throw new Error(`Failed to create comment: ${res.statusText}`);
  }

  return res.json();
};
export const createCommentResolver: MutationResolvers['createComment'] = async (
  parent,
  args,
  context,
) => {
  const accessToken = context.accessToken;

  if (!accessToken) {
    return null;
  }
  const rest = await createComment(
    {
      ...args,
      owner: context.user?.login,
    },
    accessToken,
  );

  return camelCase(rest);
};
