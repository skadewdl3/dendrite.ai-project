"use client";

import { useEffect, useState } from "react";
import Controls from "./Controls";
import { WebSocketProvider } from "next-ws/client";
import { InviteMemberResponse } from "@/lib/types/board";
import InviteModal from "./InviteModal";
import ChatWindow from "./ChatWindow";
import { ControlType } from "@/lib/types/control";
import Canvas from "./Canvas";

type Props = {
  id: number;
  inviteMemberAction: (email: string) => Promise<InviteMemberResponse>;
};

export default function Board({ id, inviteMemberAction }: Props) {
  const [activeControl, setActiveControl] = useState<ControlType>("pen");
  const [showInviteModal, setShowInviteModal] = useState(false);

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
      <ChatWindow />
      <Canvas />
      <div style={{ width: "50%" }}>
        <Controls
          setActiveControl={setActiveControl}
          activeControl={activeControl}
        />
      </div>
    </WebSocketProvider>
  );
}
