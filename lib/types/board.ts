import type { InferSelectModel } from "drizzle-orm";
import { Board } from "@db";

export type CreateBoardResponse =
  | { success: true; data: object }
  | { success: false; error: string };

export type Board = InferSelectModel<typeof Board>;

export type CreateBoardInput = Pick<Board, "name" | "description" | "public">;
