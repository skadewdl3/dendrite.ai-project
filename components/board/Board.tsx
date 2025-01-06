"use client";

import { useEffect, useState } from "react";
import Controls from "./Controls";
import { WebSocketProvider } from "next-ws/client";
import { useWebSocket } from "next-ws/client";
import { InviteMemberResponse } from "@/lib/types/board";
import InviteModal from "./InviteModal";

type Props = {
  id: number;
  inviteMemberAction: (email: string) => Promise<InviteMemberResponse>;
};

export default function Board({ id, inviteMemberAction }: Props) {
  const [activeControl, setActiveControl] = useState("pen");
  const ws = useWebSocket();
  const [messages, setMessages] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      const payload =
        typeof event.data === "string" ? event.data : await event.data.text();
      const message = JSON.parse(payload);
      setMessages((messages) => [...messages, message]);
    }

    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [ws]);

  const openInviteModal = () => setShowInviteModal(true);

  useEffect(() => {
    console.log("listeners set");
    document.addEventListener("open-invite-modal", openInviteModal);

    return () => {
      document.removeEventListener("open-invite-modal", openInviteModal);
    };
  });

  return (
    <WebSocketProvider url={`ws://localhost:3000/join/${id}`}>
      <InviteModal
        show={showInviteModal}
        handleClose={() => setShowInviteModal(false)}
        handleSubmit={inviteMemberAction}
        loading={false}
      />
      <div style={{ width: "50%" }}>
        <div className="d-flex flex-column" style={{ height: "400px" }}>
          <div
            className="flex-grow-1 p-3 bg-light border rounded mb-2"
            style={{ overflowY: "auto" }}
          >
            <div id="chat-messages">
              {/* Messages will be displayed here */}
            </div>
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // Handle sending message
                  ws?.send(
                    JSON.stringify({
                      type: "CHAT",
                      message: e.currentTarget.value,
                    }),
                  );
                  e.currentTarget.value = "";
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                ws?.send(
                  JSON.stringify({
                    type: "CHAT",
                    message: input.value,
                  }),
                );
                input.value = "";
              }}
            >
              Send
            </button>
          </div>
        </div>
        <Controls
          setActiveControl={setActiveControl}
          activeControl={activeControl}
        />
      </div>
    </WebSocketProvider>
  );
}
