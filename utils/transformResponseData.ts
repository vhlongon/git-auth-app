import { Repo, User } from '../graphql/generated/graphql-types';
import { RepoPayload } from '../graphql/resolvers/reposResolver';
import { AuthPayloadUser } from '../types';

export const transforUserResponse = (user: AuthPayloadUser): User => ({
  name: user.name,
  login: user.login,
  avatarUrl: user.avatar_url,
  id: user.id,
  url: user.url,
  location: user.location,
  email: user.email,
  publicGists: user.public_gists,
  publicRepos: user.public_repos,
  followers: user.followers,
  following: user.following,
});

export const transformRepoResponse = (repos: RepoPayload[]): Repo[] =>
  repos.map(repo => ({
    createdAt: repo.created_at,
    description: repo.description,
    forksCount: repo.forks_count,
    fullName: repo.full_name,
    homepage: repo.homepage,
    id: repo.id,
    language: repo.language,
    name: repo.name,
    openIssuesCount: repo.open_issues_count,
    owner: transforUserResponse(repo.owner),
    pushedAt: repo.pushed_at,
    size: repo.size,
    stargazersCount: repo.stargazers_count,
    updatedAt: repo.updated_at,
    url: repo.url,
    watchersCount: repo.watchers_count,
  }));
