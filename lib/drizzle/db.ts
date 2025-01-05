/**
 * Database configuration and exports
 *
 * This file sets up the database connection using Drizzle ORM
 * and exports:
 * - Database connection object (db)
 * - Auth schema objects from ./schema/auth
 */

import { drizzle } from "drizzle-orm/node-postgres";

// Make sure to update this list if we need to add/remove any schemas
export * from "./schema/auth";
export * from "./schema/board";

export const db = drizzle({
  connection: process.env.DATABASE_URL as string,
});
