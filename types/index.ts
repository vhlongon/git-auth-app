export type Credentials = {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
  grant_type?: string;
};

export type AuthPayloadUser = {
  login: string;
  name: string;
  id: number;
  avatar_url: string;
  url: string;
  location: string;
  email: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
};
