"use client";

import { useEffect, useState } from "react";
import Controls from "./Controls";
import { WebSocketProvider } from "next-ws/client";
import { useWebSocket } from "next-ws/client";

type Props = {
  id: number;
};

export default function Board({ id }: Props) {
  const [activeControl, setActiveControl] = useState("pen");
  const ws = useWebSocket();

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      const payload =
        typeof event.data === "string" ? event.data : await event.data.text();
      const message = JSON.parse(payload);
      console.log(message);
    }

    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [ws]);

  return (
    <WebSocketProvider url={`ws://localhost:3000/join`}>
      <div>
        <Controls
          setActiveControl={setActiveControl}
          activeControl={activeControl}
        />
      </div>
    </WebSocketProvider>
  );
}
