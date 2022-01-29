import { Context } from '../apolloServerContext';
import { QueryResolvers } from '../../graphql/generated/graphql-types';
import camelCase from 'camelcase-keys';
import { setHeadersWithAuthorization } from '../../utils/authUtils';
import { RepoPayload } from './reposResolver';

interface RepoResolverArgs {
  owner: string;
  name: string;
}

export const getGithubUserRepo = async (
  args: RepoResolverArgs,
  token: string,
): Promise<RepoPayload | null> => {
  const res = await fetch(
    `${process.env.RESOURCE_ENDPOINT}/repos/${args.owner}/${args.name}`,
    {
      headers: setHeadersWithAuthorization(token, { Accept: '/*' }),
    },
  );

  if (!res.ok) {
    console.error('error getGithubUserRepo', res);
    throw new Error(`Failed to fetch github user repos: ${res.statusText}`);
  }

  return res.json();
};

export const repoResolver: QueryResolvers<Context>['repo'] = async (
  parent,
  args,
  context,
) => {
  const accessToken = context.accessToken;
  const owner = context.user?.login;
  const { name } = args;

  if (!accessToken || !owner || !name) {
    return null;
  }

  const repo = await getGithubUserRepo({ owner, name }, accessToken);

  return repo ? camelCase(repo) : null;
};
