declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
      TOKEN_ENDPOINT: string;
      AUTHORIZATION_ENDPOINT: string;
      RESOURCE_ENDPOINT: string;
    }
  }
}

export {};
