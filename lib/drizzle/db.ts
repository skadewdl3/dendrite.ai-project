import { drizzle } from "drizzle-orm/node-postgres";
export * from "./schema/auth";

export const db = drizzle({
  connection: process.env.DATABASE_URL as string,
});
