import { serialize } from 'cookie';

export const setServerCookie = (
  res: any,
  name: string,
  value: string,
  options: Record<string, unknown> = {},
) => {
  const stringValue =
    typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

export const parseCookie = (cookie?: string) => {
  if (!cookie) return {};

  return cookie
    .split(';')
    .map(v => v.split('='))
    .reduce<Record<string, unknown>>((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
};
