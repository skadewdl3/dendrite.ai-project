import { Board, db, eq, and, arrayOverlaps } from "@db";
import { auth } from "@auth/server";
import { fromNodeHeaders } from "better-auth/node";

type ValidationResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      boardId: number;
      userId: string;
    };

export async function GET() {
  return new Response("Upgrade required", { status: 426 });
}

async function validateRequest(
  request: import("http").IncomingMessage,
): Promise<ValidationResponse> {
  // If client is not authenticated, close the connection
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  // Validate if client is a member of the board
  const url = new URL(request.url as string, "http://base");
  const boardId = parseInt(
    url.pathname.split("/").filter((x) => x !== "" && x !== "join")[0],
  );

  if (!boardId) {
    return { success: false, error: "Invalid Board ID" };
  }

  const board = await db
    .select()
    .from(Board)
    .where(and(eq(Board.id, boardId), arrayOverlaps(Board.members, [userId])));

  if (board.length == 0) {
    return {
      success: false,
      error: "Board not found, or you dont have access to the board",
    };
  }

  return { success: true, boardId, userId };
}

const connections = new Map<string, import("ws").WebSocket>();
const boardMembers = new Map<number, string[]>();

export async function SOCKET(
  client: import("ws").WebSocket,
  request: import("http").IncomingMessage,
  server: import("ws").WebSocketServer,
) {
  const res = await validateRequest(request);
  if (!res.success) {
    client.send(res.error);
    client.close();
    return;
  }

  const { userId, boardId } = res;

  if (!boardMembers.has(boardId)) {
    boardMembers.set(boardId, [userId]);
  } else {
    const clients = boardMembers.get(boardId) || [];
    clients.push(userId);
    boardMembers.set(boardId, clients);
  }

  connections.set(userId, client);

  client.on("message", (message) => {
    const clients = boardMembers.get(boardId) || [];
    for (const userId of clients) {
      const client = connections.get(userId);
      client?.send(message);
    }
  });

  client.on("close", () => {
    const clients = boardMembers.get(boardId) || [];
    const newClients = clients.filter((c) => c !== userId);
    boardMembers.set(boardId, newClients);
    console.log("A client disconnected");
  });
}
