import { Board, BoardData, db, eq, and, arrayOverlaps } from "@db";
import { auth } from "@auth/server";
import { fromNodeHeaders } from "better-auth/node";
import { Canvas, util, FabricObject } from "fabric/node";

FabricObject.customProperties = ["id"];

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

function getUniqueColor(boardId: number, limit = 10): string {
  const clients = boardMembers.get(boardId) || new Set();
  const usedColors = new Set([...clients].map((client) => client.color));

  for (let i = 0; i < limit; i++) {
    const color =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    if (!usedColors.has(color)) {
      return color;
    }
  }

  return null;
}

type Client = {
  id: string;
  color: string;
};

const connections = new Map<string, import("ws").WebSocket>();
const boardMembers = new Map<number, Set<Client>>();
const canvases = new Map<number, Canvas>();

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

  const clients = boardMembers.get(boardId) || new Set();
  const clientData = {
    id: userId,
    color: getUniqueColor(boardId),
  };
  clients.add(clientData);
  if (!canvases.has(boardId)) {
    const canvasData = await db
      .select()
      .from(BoardData)
      .where(eq(BoardData.boardId, boardId));
    if (canvasData.length == 0) return;
    const canvas = new Canvas();
    if (canvasData != null) {
      await canvas.loadFromJSON(canvasData[0].data);
    }
    canvases.set(boardId, canvas);
  }
  boardMembers.set(boardId, clients);

  client.userId = userId;
  connections.set(userId, client);

  const { broadcast } = createHelpers(server, client, boardId);

  client.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    if (messageData.type == "mouse:move") {
      messageData.data.color = clientData.color;
      messageData.data.id = clientData.id;
    }
    if (messageData.type.startsWith("canvas:")) {
      const canvas = canvases.get(boardId);
      if (!canvas) return;
      const changes = await util.enlivenObjects([messageData.data]);

      if (messageData.type == "canvas:add") {
        changes.forEach((obj) => canvas.add(obj));
      } else {
        changes.forEach((obj) => canvas.remove(obj));
      }
      canvas.renderAll();
    }

    broadcast(messageData);
    await db
      .update(BoardData)
      .set({
        data: canvases.get(boardId)?.toDatalessJSON(["id"]) || null,
      })
      .where(eq(BoardData.boardId, boardId));

    broadcast(messageData);
  });

  client.on("close", () => {
    boardMembers.get(boardId)?.delete(clientData);
    broadcast({ type: "client:disconnect", data: { id: clientData.id } });

    if (boardMembers.get(boardId)?.size == 0) {
      canvases.delete(boardId);
      boardMembers.delete(boardId);
    }
  });

  client.send(
    JSON.stringify({
      type: "client:connect",
      data: { board: canvases.get(boardId), id: clientData.id },
    }),
  );
}

const createHelpers = (
  server: import("ws").WebSocketServer,
  client: import("ws").WebSocket,
  boardId: number,
): {
  broadcast: (data: object) => void;
} => {
  const connectedClients = Array.from(boardMembers.get(boardId) || []).map(
    (x) => x.id,
  );
  return {
    broadcast: (data: object) => {
      if (!connectedClients) return;
      server.clients.forEach((ws) => {
        if (
          connectedClients.includes(ws.userId) &&
          client.userId !== ws.userId
        ) {
          console.log("sending memessage to ", ws.userId);
          ws.send(JSON.stringify(data));
        }
      });
    },
  };
};
