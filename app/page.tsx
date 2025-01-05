import { Board, db, User } from "@db";
import Temp from "./Temp";
import { auth } from "@auth/server";
import { headers } from "next/headers";
import { CreateBoardResponse } from "@/lib/types/board";

export default async function Home() {
  const createBoardAction = async (
    name: string,
  ): Promise<CreateBoardResponse> => {
    "use server";
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData)
      return {
        success: false,
        error: "You must be logged in to create a board",
      };

    if (name.trim().length == 0)
      return {
        success: false,
        error: "Board name cannot be empty",
      };

    const { user } = sessionData;

    console.log(user);

    const res = await db
      .insert(Board)
      .values({ name, members: [user.id], updatedAt: new Date() })
      .returning();

    return { success: true, data: res };
  };

  // const data = JSON.stringify(res);
  return (
    <div>
      <Temp createBoardAction={createBoardAction} />
    </div>
  );
}
