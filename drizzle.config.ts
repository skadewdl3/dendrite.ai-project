import "dotenv";
import { defineConfig } from "drizzle-kit";
import "@/lib/env";

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
