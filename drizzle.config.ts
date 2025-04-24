/*
 * This file configures the Drizzle ORM library for database migrations.
 * It allows Drizzle Kit to automatically generate migrations for the database schema.
 *
 * It exports a configuration object that defines:
 * - Location of the schema files (for automatic migrations)
 * - Output directory for migrations
 * - The type of dataase we're using i.e. Postgres
 * - Database connection credentials
 * - Logging verbosity and strict mode settings
 */

import { defineConfig } from "drizzle-kit";
import "@/lib/env";

console.log("url is: ", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./lib/drizzle/schema",
  out: "./lib/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
