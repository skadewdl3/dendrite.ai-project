"use client";
import {
  Pen,
  Eraser,
  Chat,
  ArrowClockwise,
  ArrowCounterclockwise,
  CircleFill,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import type { ControlType } from "@types/control";
import { ReactNode, useEffect, useState } from "react";
import Tooltip from "@/components/Tooltip";
import Dropdown from "./Dropdown";

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

  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);

  const undo = () => {
    const event = new Event("undo");
    document.dispatchEvent(event);
  };

  const redo = () => {
    const event = new Event("redo");
    document.dispatchEvent(event);
  };

  const updateColor = (color: string) => {
    setColor(color);
    const event = new CustomEvent("color", { detail: { color } });
    document.dispatchEvent(event);
  };

  const updateThickness = (thickness: number) => {
    setThickness(thickness);
    const event = new CustomEvent("thickness", { detail: { thickness } });
    document.dispatchEvent(event);
  };
  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#000000", // Black
    "#FFFFFF", // White
    "#FFA500", // Orange
  ];

  const thicknesses = [2, 5, 8, 12, 15];

  useEffect(() => {
    updateColor(color);
    updateThickness(thickness);
    console.log("this ran");
  }, []);

  return (
    <>
      <div
        className="d-flex position-relative"
        style={{
          gap: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          marginRight: "10px",
        }}
      >
        <Dropdown
          gridColumns={1}
          trigger={
            <Tooltip text="Thickness">
              <div
                style={{
                  height: `${thickness}px`,
                  width: "20px",
                  backgroundColor: "black",
                  margin: "5px 0",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          }
        >
          {thicknesses.map((thickness) => (
            <div
              key={thickness}
              onClick={() => updateThickness(thickness)}
              style={{
                height: `15px`,
                width: "100%",
                cursor: "pointer",
              }}
            >
              <div
                style={{ height: `${thickness}px`, backgroundColor: "black" }}
              />
            </div>
          ))}
        </Dropdown>
        <Dropdown
          trigger={
            <Tooltip text="Color">
              <CircleFill fill={color} />
            </Tooltip>
          }
        >
          {colors.map((color) => (
            <CircleFill
              style={{ cursor: "pointer" }}
              key={color}
              fill={color}
              onClick={() => updateColor(color)}
            />
          ))}
        </Dropdown>
      </div>
      <div
        className="d-flex position-relative"
        style={{
          gap: "10px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {controls.map((control, index) => (
          <Tooltip text={control.label} key={index}>
            <Button
              onClick={() => setActiveControl(control.name)}
              variant="light"
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",

                backgroundColor:
                  activeControl == control.name ? "#ccc" : "#fff",
              }}
            >
              {control.icon}
            </Button>
          </Tooltip>
        ))}

        <Tooltip text="Undo">
          <Button
            onClick={undo}
            variant="light"
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <ArrowCounterclockwise />
          </Button>
        </Tooltip>
        <Tooltip text="Redo">
          <Button
            onClick={redo}
            variant="light"
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <ArrowClockwise />
          </Button>
        </Tooltip>

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
      </div>
    </>
  );
}
