export type CreateBoardResponse =
  | { success: true; data: object }
  | { success: false; error: string };
