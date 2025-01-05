import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import "./env";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_CLIENT_ID as string,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
          discoveryUrl: process.env.KEYCLOAK_URL as string,
        },
      ],
    }),
  ],
});
