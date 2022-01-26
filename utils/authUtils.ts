export const setHeadersWithAuthorization = (
  token: string,
  options: Record<string, string> = {},
) => {
  return { Authorization: `token ${token}`, ...options };
};
