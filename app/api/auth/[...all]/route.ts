/*
 * This file implements a Next.js API route handler for authentication.
 * It converts the auth handler from the better-auth library into compatible Next.js request handlers.
 * DO NOT EDIT OR MOVE THIS FILE
 */

import { auth } from "@auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
