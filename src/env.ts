declare global {
  interface Window {
    env: any;
  }
}

type EnvType = {
  NODE_ENV: string;
  REACT_APP_API_KEY: string;
};
export const env: EnvType = { ...process.env, ...window.env };
