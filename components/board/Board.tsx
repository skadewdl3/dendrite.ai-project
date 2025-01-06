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

type Props = {
  id: number;
  userId: string;
  inviteMemberAction: (email: string) => Promise<InviteMemberResponse>;
};

export default function Board({ id, inviteMemberAction, userId }: Props) {
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

  return (
    <WebSocketProvider url={`ws://localhost:3000/join/${id}`}>
      <InviteModal
        show={showInviteModal}
        handleClose={() => setShowInviteModal(false)}
        handleSubmit={inviteMemberAction}
        loading={false}
      />

      <Canvas tool={activeControl} />
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
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <Controls
          setActiveControl={setActiveControl}
          activeControl={activeControl}
          toggleChat={() => setShowChat(!showChat)}
          chatOpen={showChat}
        />
      </div>
    </WebSocketProvider>
  );
}
