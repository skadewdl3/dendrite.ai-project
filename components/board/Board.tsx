"use client";

import { useState } from "react";
import Controls from "./Controls";

type Props = {
  id: number;
};

export default function Board({ id }: Props) {
  const [activeControl, setActiveControl] = useState("pen");

  return (
    <div>
      <Controls
        setActiveControl={setActiveControl}
        activeControl={activeControl}
      />
    </div>
  );
}
