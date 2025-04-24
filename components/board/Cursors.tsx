"use client";

import { useWebSocket } from "next-ws/client";
import { useEffect, useState } from "react";
import { CursorFill } from "react-bootstrap-icons";
import { throttle } from "underscore";

type CursorData = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
};

export default function Cursors() {
  const ws = useWebSocket();
  const [clients, setClients] = useState<CursorData[]>([]);

  const onMouseMove = async (event: MouseEvent) => {
    if (!ws) return;
    ws?.send(
      JSON.stringify({
        type: "mouse:move",
        data: {
          x: event.clientX,
          y: event.clientY,
        },
      }),
    );
  };

  const onMessage = async (event: MessageEvent) => {
    const message =
      typeof event.data === "string" ? event.data : await event.data.text();

    const { data, type } = JSON.parse(message);
    if (type == "mouse:move") {
      console.log("mouse update: ", data);

      setClients((clients) => {
        const existingClient = clients.find((client) => client.id === data.id);
        if (existingClient) {
          return clients.map((client) =>
            client.id === data.id
              ? { ...client, x: data.x, y: data.y }
              : client,
          );
        } else {
          return [...clients, data];
        }
      });
    } else if (type == "client:disconnect") {
      console.log("remove client", data);

      setClients((clients) => clients.filter((client) => client.id != data.id));
    }
  };

  useEffect(() => {
    ws?.addEventListener("message", onMessage);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      ws?.removeEventListener("message", onMessage);
      document.removeEventListener("mousemove", onMouseMove);
    };
  });

  useEffect(() => {});

  return (
    <>
      {clients.map((data, i) => (
        <div key={i}>
          <CursorFill
            fill={data.color}
            style={{
              position: "absolute",
              top: `${data.y}px`,
              left: `${data.x}px`,
              transition: "all 0.5s ease-in-out",
              transform: "scaleX(-1)",
            }}
          />
          <p
            style={{
              position: "absolute",
              top: `${data.y + 10}px`,
              left: `${data.x}px`,
              transition: "all 0.5s ease-in-out",
            }}
          >
            {data.name}{" "}
          </p>
        </div>
      ))}
    </>
  );
}
