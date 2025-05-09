"use client";

import { useEffect, useState } from "react";
import Controls from "./Controls";
import { WebSocketProvider } from "next-ws/client";
import { InviteMemberResponse } from "@/lib/types/board";
import InviteModal from "./InviteModal";
import ChatWindow from "./ChatWindow";
import { ControlType } from "@/lib/types/control";
import Canvas from "./Canvas";
import Offcanvas from "react-bootstrap/Offcanvas";
import Cursors from "./Cursors";

type Props = {
  id: number;
  userId: string;
  inviteMemberAction: (email: string) => Promise<InviteMemberResponse>;
  boardData: string | null;
};

export default function Board({
  id,
  inviteMemberAction,
  userId,
  boardData,
}: Props) {
  const [activeControl, setActiveControl] = useState<ControlType>("pencil");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const openInviteModal = () => setShowInviteModal(true);
  useEffect(() => {
    document.addEventListener("open-invite-modal", openInviteModal);

    return () => {
      document.removeEventListener("open-invite-modal", openInviteModal);
    };
  });

  const BASE_URL =
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEV_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL;

  return (
    <WebSocketProvider url={`ws://${BASE_URL}/join/${id}`}>
      <InviteModal
        show={showInviteModal}
        handleClose={() => setShowInviteModal(false)}
        handleSubmit={inviteMemberAction}
        loading={false}
      />

      <Canvas tool={activeControl} initialData={boardData} />
      <Offcanvas
        show={showChat}
        onHide={() => setShowChat(false)}
        backdrop={false}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Chat</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ChatWindow userId={userId} />
        </Offcanvas.Body>
      </Offcanvas>
      <div
        className="position-fixed d-flex"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "10px",
        }}
      >
        <Controls
          setActiveControl={setActiveControl}
          activeControl={activeControl}
          toggleChat={() => setShowChat(!showChat)}
          chatOpen={showChat}
        />
      </div>
      <Cursors />
    </WebSocketProvider>
  );
}
