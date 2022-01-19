import { Context } from '../apolloServerContext';
import { RepoResolvers } from '../../graphql/generated/graphql-types';
import { AuthPayloadUser } from '../../types';
import camelCase from 'camelcase-keys';

export type IssuePayload = {
  url: string;
  comments_url: string;
  id: number;
  number: number;
  user: AuthPayloadUser;
  repository_url: string;
  html_url: string;
};

export const getRepoIssues = async (
  token: string,
  url: string,
): Promise<IssuePayload[] | null> => {
  const res = await fetch(`${process.env.RESOURCE_ENDPOINT}/${url}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: '/*',
    },
  });

  if (!res.ok) {
    console.error('error getRepoIssues', res);
    throw new Error(
      `Failed to fetch github user repo issues: ${res.statusText}`,
    );
  }

  return res.json();
};

export const issueResolver: RepoResolvers<Context>['issues'] = async (
  parent,
  _args,
  context,
) => {
  if (!context.accessToken) {
    return null;
  }
  const issuesUrl = `repos/${parent.owner.login}/${parent.name}/issues`;
  const issues = await getRepoIssues(context.accessToken, issuesUrl);

  return issues?.length ? issues.map(i => camelCase(i)) : [];
};
