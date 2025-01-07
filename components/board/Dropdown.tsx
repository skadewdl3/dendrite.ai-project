"use client";

import Button from "react-bootstrap/Button";
import { useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  width?: string | number;
  gridColumns?: number;
  children: React.ReactNode[];
}

export default function Dropdown({
  trigger,
  width = "150px",
  gridColumns = 3,
  children,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.style.display = "none";
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative">
      <Button
        variant="light"
        className="d-flex align-items-center justify-content-center"
        onClick={() => {
          if (dropdownRef.current) {
            dropdownRef.current.style.display =
              dropdownRef.current.style.display === "grid" ? "none" : "grid";
          }
        }}
        style={{
          width: "40px",
          height: "40px",
        }}
      >
        {trigger}
      </Button>

      <div
        ref={dropdownRef}
        style={{
          display: "none",
          position: "absolute",
          bottom: 0,
          left: 0,
          transform: "translateY(-50%)",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          width: width,
          zIndex: 1000,
          padding: "4px",
        }}
      >
        {children.map((item, index) => (
          <div
            key={index}
            className="p-2 text-center"
            onClick={() => {
              if (dropdownRef.current) {
                dropdownRef.current.style.display = "none";
              }
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
