"import client";
import { Pen, Eraser, Chat } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import type { ControlType } from "@types/control";
import { ReactNode } from "react";
import Tooltip from "@/components/Tooltip";

type Props = {
  activeControl: ControlType;
  setActiveControl: (control: ControlType) => void;
  toggleChat: () => void;
  chatOpen: boolean;
};

export default function Controls({
  activeControl,
  setActiveControl,
  toggleChat,
  chatOpen,
}: Props) {
  const controls: Array<{ name: ControlType; label: string; icon: ReactNode }> =
    [
      {
        name: "pencil",
        label: "Pencil",
        icon: <Pen />,
      },
      {
        name: "eraser",
        label: "Eraser",
        icon: <Eraser />,
      },
    ];

  return (
    <div className="d-flex position-relative" style={{ gap: "10px" }}>
      {controls.map((control, index) => (
        <Tooltip text={control.label} key={index}>
          <Button
            onClick={() => setActiveControl(control.name)}
            variant="light"
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            {control.icon}
          </Button>
        </Tooltip>
      ))}

      <Tooltip text="Chat">
        <Button
          onClick={toggleChat}
          variant="light"
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: chatOpen ? "#ccc" : "#fff",
          }}
        >
          <Chat />
        </Button>
      </Tooltip>

      <div
        className="position-absolute"
        style={{
          height: "5px",
          width: "40px",
          background: "#0d6efd",
          bottom: "-5px",
          left: `calc(${(controls.findIndex((x) => x.name == activeControl) / controls.length) * 100}% + ${(controls.findIndex((x) => x.name == activeControl) / controls.length) * 10}px)`,
          transition: "left 0.3s ease-in-out",
          borderRadius: "5px",
        }}
      />
    </div>
  );
}
