import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, User, Session, Verification, Account } from "@db";
import "@env";

// Create a new instance of the authentication library, better-auth
export const auth = betterAuth({
  // We;re using Drizzle as the ORM, so we'll need to use an adapter to allow better-auth to use it
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { User, Session, Verification, Account },
  }),

  // Allow the localhost:3000 origin to be trusted for auth requests.
  trustedOrigins: ["http://localhost:3000"],

  // Enable the generic OAuth plugin for Keycloak, and pass in the required env variables
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

  // Out schema models use different names than the default, so we need to specify them here
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
  },

  // Automatically link the better-auth account to the keycloak provider on login/sign up
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
