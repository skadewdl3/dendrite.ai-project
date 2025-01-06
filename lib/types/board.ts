import type { InferSelectModel } from "drizzle-orm";
import { Board, Invitation } from "@db";

export type CreateBoardResponse =
  | { success: true; data: object }
  | { success: false; error: string };

export type Board = InferSelectModel<typeof Board>;

export type CreateBoardInput = Pick<Board, "name" | "description" | "public">;

export type DeleteBoardResponse =
  | { success: true; data: object }
  | { success: false; error: string };

export type DeleteBoardInput = Pick<Board, "id">;

export type Invitation = InferSelectModel<typeof Invitation>;

export type GetInvitationsResponse =
  | { success: true; data: Invitation[] }
  | { success: false; error: string };

export type InviteMemberInput = { boardId: number; email: string };
export type InviteMemberResponse =
  | { success: true; data: object }
  | { success: false; error: string };
