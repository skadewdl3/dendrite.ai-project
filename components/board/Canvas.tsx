import { setFreeDrawing } from "@/lib/fabric/drawing";
import { setupCanvas, setupCanvasListeners } from "@/lib/fabric/init";
import { ControlType } from "@/lib/types/control";
import { Canvas as FabricCanvas } from "fabric";
import { useWebSocket } from "next-ws/client";
import { useEffect, useRef, useState } from "react";

type Props = {
  tool: ControlType;
};

export default function Canvas({ tool }: Props) {
  const canvasEl = useRef(null);
  const canvasContainer = useRef(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const ws = useWebSocket();

  useEffect(() => {
    if (!canvasEl.current || !canvasContainer.current) return;
    const style = getComputedStyle(canvasContainer.current);
    const width = parseInt(style.getPropertyValue("width"));
    const height = parseInt(style.getPropertyValue("height"));
    const canvasContext = setupCanvas(canvasEl.current, width, height);
    setFreeDrawing(canvasContext, true, tool);
    setCanvas(canvasContext);
    setupCanvasListeners(canvasContext, ws as WebSocket);

    return () => {
      canvas?.dispose();
      setCanvas(null);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    if (tool != "pencil" && tool != "eraser") {
      setFreeDrawing(canvas, false);
      return;
    }
    setFreeDrawing(canvas, true, tool);
  }, [canvas, tool]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: "56px",
      }}
      ref={canvasContainer}
    >
      <canvas ref={canvasEl} />
    </div>
  );
}
