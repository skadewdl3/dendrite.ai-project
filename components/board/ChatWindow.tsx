"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "next-ws/client";

type Props = {
  userId: string;
};

type Message = {
  sender: string;
  message: string;
};

export default function ChatWindow({ userId }: Props) {
  const ws = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      const message =
        typeof event.data === "string" ? event.data : await event.data.text();
      const messageObject = JSON.parse(message);
      console.log("chat received");
      if (messageObject.type != "chat") return;
      setMessages((messages) => [...messages, messageObject.data]);
    }

    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [ws]);

  const sendMessage = () => {
    console.log(ws);
    const data = {
      message,
      sender: "You",
    };

    ws?.send(
      JSON.stringify({
        type: "chat",
        data,
      }),
    );
    setMessages((m) => [...m, data]);
    setMessage("");
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      <div
        className="flex-grow-1 p-3 bg-light border rounded mb-2"
        style={{ overflowY: "auto" }}
      >
        <div id="chat-messages">
          {messages.map((m, i) => (
            <div key={i}>
              <strong>{m.sender}: </strong>
              {m.message}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex" style={{}}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
