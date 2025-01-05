/*
 * This file defines TypeScript schema definitions for database tables using drizzle-orm.
 *
 * Exports:
 * - Board: Schema for collaborative drawing boards
 *
 * Instructions to modify:
 * After modifying this file, make sure to run "bun migrate" to update the database schema.
 */

import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { User } from "./auth";

export const Board = pgTable("_board", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  members: text("members")
    .references(() => User.id)
    .array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
