import { Context } from '../apolloServerContext';
import { QueryResolvers } from '../../graphql/generated/graphql-types';
import { setHeadersWithAuthorization } from '../../utils/authUtils';
import { CommentPayload, transformComments } from './commentResolver';

interface RepoResolverArgs {
  owner: string;
  number: number;
  name: string;
}

export const getGithubIssueComments = async (
  args: RepoResolverArgs,
  token: string,
): Promise<CommentPayload[] | null> => {
  const res = await fetch(
    `${process.env.RESOURCE_ENDPOINT}/repos/${args.owner}/${args.name}/issues/${args.number}/comments`,
    {
      headers: setHeadersWithAuthorization(token, { Accept: '/*' }),
    },
  );

  if (!res.ok) {
    console.error('error getGithubIssueComments', res);
    throw new Error(`Failed to fetch github user repos: ${res.statusText}`);
  }

  return res.json();
};

export const commentsResolver: QueryResolvers<Context>['comments'] = async (
  parent,
  args,
  context,
) => {
  const accessToken = context.accessToken;
  const owner = context.user?.login;
  const { number, name } = args;

  if (!accessToken || !owner || !number || !name) {
    return null;
  }

  const comments = await getGithubIssueComments(
    { owner, number, name },
    accessToken,
  );

  console.log(comments)

  return comments ? transformComments(comments) : null;
};
