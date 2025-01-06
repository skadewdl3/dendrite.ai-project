"use client";

import { useWebSocket } from "next-ws/client";
import { useEffect, useState } from "react";
import { CursorFill } from "react-bootstrap-icons";
import { throttle } from "underscore";

type CursorData = {
  color: string;
  x: number;
  y: number;
};

export default function Cursors() {
  const ws = useWebSocket();
  const [clients, setClients] = useState<CursorData[]>([]);

  const onMouseMove = throttle((event: MouseEvent) => {
    // console.log("sent ", event);
    ws?.send(
      JSON.stringify({
        type: "mouse:move",
        data: {
          mouseX: event.clientX,
          mouseY: event.clientY,
        },
      }),
    );
  }, 500);

  const onMessage = throttle(async (event: MessageEvent) => {
    const message =
      typeof event.data === "string" ? event.data : await event.data.text();

    const { data, type } = JSON.parse(message);
    if (type == "mouse:move") {
      console.log("mouse update: ", data);
    } else if (type == "client:disconnect") {
      console.log("remove client", data);
    }
    // setClients(data);
  }, 500);

  useEffect(() => {
    ws?.addEventListener("message", onMessage);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      ws?.removeEventListener("message", onMessage);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {});

  return (
    <>
      {clients.map((data, i) => (
        <CursorFill
          key={i}
          style={{
            position: "absolute",
            top: `${data.y}px`,
            left: `${data.y}px`,
            transition: "all 0.5s ease-in-out",
          }}
        />
      ))}
    </>
  );
}
