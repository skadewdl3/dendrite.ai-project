import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, User, Session, Verification, Account } from "@db";
import "@env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { User, Session, Verification, Account },
  }),
  trustedOrigins: ["http://localhost:3000"],
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KC_CLIENT_ID as string,
          clientSecret: process.env.KC_CLIENT_SECRET as string,
          discoveryUrl: process.env.KC_URL as string,
          scopes: ["openid", "email", "profile"],
          pkce: true,
        },
      ],
    }),
  ],
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
    accountLinking: {
      enabled: true,
      trustedProviders: ["keycloak"],
    },
  },
  verification: {
    modelName: "Verification",
  },
});
