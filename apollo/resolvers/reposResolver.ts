import { Context } from '../apolloServerContext';
import {
  QueryReposArgs,
  QueryResolvers,
} from '../../graphql/generated/graphql-types';
import { AuthPayloadUser } from '../../types';
import camelCase from 'camelcase-keys';
import { setHeadersWithAuthorization } from '../../utils/authUtils';

export type Permissions = {
  admin: boolean;
  maintain: boolean;
  push: boolean;
  triage: boolean;
  pull: boolean;
};

export type RepoPayload = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: AuthPayloadUser;
  html_url: string;
  description?: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage?: any;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url?: string;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license?: string;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: Permissions;
};

export const getGithubUserRepos = async (
  token: string,
  args: QueryReposArgs,
): Promise<RepoPayload[] | null> => {
  const params = `page=${args.page}&per_page=${args.perPage}`;

  const res = await fetch(
    `${process.env.RESOURCE_ENDPOINT}/user/repos?${params}`,
    {
      headers: setHeadersWithAuthorization(token, { Accept: '/*' }),
    },
  );

  if (!res.ok) {
    console.error('error getGithubUserRepos', res);
    throw new Error(`Failed to fetch github user repos: ${res.statusText}`);
  }

  return res.json();
};

export const reposResolver: QueryResolvers<Context>['repos'] = async (
  parent,
  args,
  context,
) => {
  if (!context.accessToken) {
    return null;
  }

  try {
    const repos = await getGithubUserRepos(context.accessToken, args);
    return repos?.length ? repos.map(r => camelCase(r)) : null;
  } catch (error) {
    return null;
  }
};
