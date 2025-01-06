import { Board, db, arrayOverlaps, eq } from "@db";
import Home from "@/components/home/Home";
import { auth } from "@auth/server";
import { headers } from "next/headers";
import {
  CreateBoardInput,
  CreateBoardResponse,
  DeleteBoardInput,
  DeleteBoardResponse,
} from "@types/board";
import HomeUnauthorized from "@/components/home/HomeUnauthorized";

export default async function HomePage() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) {
    return <HomeUnauthorized />;
  }

  const createBoardAction = async (
    data: CreateBoardInput,
  ): Promise<CreateBoardResponse> => {
    "use server";

    if (data.name.trim().length == 0)
      return {
        success: false,
        error: "Board name cannot be empty",
      };

    console.log(data);

    const { user } = sessionData;
    const res = await db
      .insert(Board)
      .values({ ...data, members: [user.id], updatedAt: new Date() })
      .returning();

    return { success: true, data: res };
  };

  const deleteBoardAction = async ({
    id,
  }: DeleteBoardInput): Promise<DeleteBoardResponse> => {
    "use server";

    if (id < 0) return { success: false, error: "Board ID cannot be negative" };

    const res = await db.delete(Board).where(eq(Board.id, id)).returning();

    return { success: true, data: res };
  };

  const { user } = sessionData;

  // fetch boards which the user owns/is a member of
  const boards = await db
    .select()
    .from(Board)
    .where(arrayOverlaps(Board.members, [user.id]));

  console.log(boards);

  return (
    <Home
      createBoardAction={createBoardAction}
      deleteBoardAction={deleteBoardAction}
      boards={boards}
    />
  );
}
