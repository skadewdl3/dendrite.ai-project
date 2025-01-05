"import client";
import { Pen, Eraser } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import type { ControlType } from "@types/control";

type Props = {
  activeControl: ControlType;
  setActiveControl: (control: ControlType) => void;
};

export default function Controls({ activeControl, setActiveControl }: Props) {
  const controls = [
    {
      name: "pen",

      icon: <Pen />,
    },
    {
      name: "eraser",
      icon: <Eraser />,
    },

    {
      name: "bruh",
      icon: <Eraser />,
    },
  ];

  return (
    <div
      className="position-fixed"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "10px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      {/* {`${(controls.findIndex((x) => x.name == activeControl) / controls.length) * 100}%`} */}
      <div className="d-flex position-relative" style={{ gap: "10px" }}>
        {controls.map((control, index) => (
          <Button
            key={index}
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
        ))}

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
    </div>
  );
}
