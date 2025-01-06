import { db, Board, eq, Invitation, User } from "@db";
import Button from "react-bootstrap/Button";
import BoardComponent from "@/components/board/Board";
import { InviteMemberResponse } from "@/lib/types/board";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export default async function BoardPage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string[]>>;
}) {
  const params = await paramsPromise;
  const boardId = parseInt(params.boardId[0] as string);

  const board = await db.select().from(Board).where(eq(Board.id, boardId));
  const invitations = await db
    .select()
    .from(Invitation)
    .where(eq(Invitation.boardId, boardId));

  const inviteMemberAction = async (
    email: string,
  ): Promise<InviteMemberResponse> => {
    "use server";

    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return { error: "Unauthorized", success: false };
    }

    const to = await db.select().from(User).where(eq(User.email, email));
    if (to.length == 0) {
      return { error: "User not found", success: false };
    }

    const toId = to[0].id;

    console.log(to, boardId);

    const { user } = sessionData;
    const res = await db
      .insert(Invitation)
      .values({ boardId, from: user.id, to: toId })
      .returning();

    return { success: true, data: res };
  };

  if (board.length == 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ marginTop: "200px" }}
      >
        <div>
          <h2 className="text-center mb-4">Board Not Found</h2>
          <p className="text-center text-muted mb-4">
            Sorry, the board you're looking for doesn't exist or may have been
            moved.
          </p>
          <div className="text-center">
            <Button href="/" className="btn btn-primary">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BoardComponent
      id={boardId}
      invitations={invitations}
      inviteMemberAction={inviteMemberAction}
    />
  );
}
