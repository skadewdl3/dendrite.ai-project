import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const NODE_ENV = process.env.NODE_ENV;

export const ENV = {
  NEXT_PUBLIC_BASE_URL:
    NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL,
};
