import { Board, db } from "@db";
import Home from "./Home";
import { auth } from "@auth/server";
import { headers } from "next/headers";
import { CreateBoardInput, CreateBoardResponse } from "@types/board";
import { arrayOverlaps } from "drizzle-orm";
import HomeUnauthorized from "./HomeUnauthorized";

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

    return { success: false, error: "bruh" };

    const { user } = sessionData;
    const res = await db
      .insert(Board)
      .values({ name, members: [user.id], updatedAt: new Date() })
      .returning();

    return { success: true, data: res };
  };

  const { user } = sessionData;

  // fetch boards which the user owns/is a member of
  const boards = await db
    .select()
    .from(Board)
    .where(arrayOverlaps(Board.members, [user.id]));

  return <Home createBoardAction={createBoardAction} boards={boards} />;
}
