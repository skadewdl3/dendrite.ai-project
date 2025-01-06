/*
 * This file defines TypeScript schema definitions for database tables using drizzle-orm.
 *
 * Exports:
 * - Board: Schema for collaborative drawing boards
 *
 * Instructions to modify:
 * After modifying this file, make sure to run "bun migrate" to update the database schema.
 */

import {
  pgTable,
  text,
  timestamp,
  serial,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { User } from "./auth";

export const Board = pgTable("_board", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  members: text("members")
    .references(() => User.id)
    .array()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  public: boolean("public").default(false).notNull(),
  description: text("description"),
});
export const Invitation = pgTable(
  "_invitation",
  {
    boardId: serial("board_id")
      .references(() => Board.id)
      .notNull(),
    from: text("from_id")
      .references(() => User.id)
      .notNull(),
    to: text("to_id")
      .references(() => User.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: text("status", {
      enum: ["pending", "accepted", "rejected"],
    })
      .notNull()
      .default("pending"),
  },
  (table) => {
    return [
      {
        pk: primaryKey({
          columns: [table.to, table.boardId],
        }),
      },
    ];
  },
);
