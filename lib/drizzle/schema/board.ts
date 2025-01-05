/*
 * This file defines TypeScript schema definitions for database tables using drizzle-orm.
 *
 * Exports:
 * - Board: Schema for collaborative drawing boards
 *
 * Instructions to modify:
 * After modifying this file, make sure to run "bun migrate" to update the database schema.
 */

import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { User } from "./auth";

export const Board = pgTable("_board", {
  id: text("id").primaryKey(),
  members: text("members")
    .array()
    .$type<string[]>()
    .references(() => User.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
