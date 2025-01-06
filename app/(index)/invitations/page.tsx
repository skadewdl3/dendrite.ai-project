import { Invitation, db, eq, and } from "@db";
import Invitations from "@/components/invitations/Invitations";
import { auth } from "@auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Invitation as InvitationType } from "@types/board";

export default async function HomePage() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) {
    return redirect("/");
  }

  const { user } = sessionData;

  const acceptInvitation = async (invitation: InvitationType) => {
    "use server";
    await db
      .update(Invitation)
      .set({ status: "accepted" })
      .where(
        and(
          eq(Invitation.from, invitation.from),
          eq(Invitation.boardId, invitation.boardId),
          eq(Invitation.to, user.id),
        ),
      );
  };

  const rejectInvitation = async (invitation: InvitationType) => {
    "use server";

    await db
      .update(Invitation)
      .set({ status: "rejected" })
      .where(
        and(
          eq(Invitation.from, invitation.from),
          eq(Invitation.boardId, invitation.boardId),
          eq(Invitation.to, user.id),
        ),
      );
  };

  // fetch boards which the user owns/is a member of
  const invitations = await db
    .select()
    .from(Invitation)
    .where(eq(Invitation.to, user.id));

  return (
    <Invitations
      invitations={invitations}
      accpetInvitation={acceptInvitation}
      rejectInvitation={rejectInvitation}
    />
  );
}
