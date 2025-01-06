"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "next-ws/client";

export default function ChatWindow() {
  const ws = useWebSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log("this ran");
    async function onMessage(event: MessageEvent) {
      console.log("got a message");
      const message =
        typeof event.data === "string" ? event.data : await event.data.text();
      console.log(message);
      setMessages((messages) => [...messages, message]);
    }

    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [ws]);

  const sendMessage = () => {
    console.log(ws);
    ws?.send(message);
    console.log(message);
    setMessages((m) => [...m, message]);
    setMessage("");
  };

  return (
    <div className="d-flex flex-column" style={{ height: "400px" }}>
      <div
        className="flex-grow-1 p-3 bg-light border rounded mb-2"
        style={{ overflowY: "auto" }}
      >
        <div id="chat-messages">
          {messages.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      </div>
      <div className="d-flex">
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
