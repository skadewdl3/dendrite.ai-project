/*
 * This file establishes the authentication client to handle OAuth authentication.
 * It uses the better-auth library and configures it with a generic OAuth plugin.
 *
 * Two different instance of the auth client are exported here:
 * - authClient: The client for the browser, for use with native JS.
 * - reactAuthClient: Provides react specific utilities for loading state, etc. during auth processes.
 */

import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});
