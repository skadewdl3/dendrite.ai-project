import {
  removeColorThicknessListeners,
  setupColorThicknessListeners,
} from "@/lib/fabric/color-thickness";
import { setFreeDrawing } from "@/lib/fabric/drawing";
import { setupCanvas, setupCanvasListeners } from "@/lib/fabric/init";
import { removeSaveListeners, setupSaveListeners } from "@/lib/fabric/save";
import {
  removeDocumentListeners,
  setupDocumentListeners,
} from "@/lib/fabric/undo-redo";
import { ControlType } from "@/lib/types/control";
import { Canvas as FabricCanvas } from "fabric";
import { useWebSocket } from "next-ws/client";
import { useEffect, useRef, useState } from "react";

type Props = {
  tool: ControlType;
  initialData: string | null;
};

export default function Canvas({ tool, initialData }: Props) {
  const canvasEl = useRef(null);
  const canvasContainer = useRef(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const ws = useWebSocket();

  const initializeAll = async () => {
    if (!canvasEl.current || !canvasContainer.current) return;
    const style = getComputedStyle(canvasContainer.current);
    const width = parseInt(style.getPropertyValue("width"));
    const height = parseInt(style.getPropertyValue("height"));
    const canvasContext = await setupCanvas({
      canvasElement: canvasEl.current,
      width,
      height,
      initialData,
    });
    setFreeDrawing(canvasContext, true, tool);
    setCanvas(canvasContext);
    setupDocumentListeners(canvasContext);
    setupCanvasListeners(canvasContext, ws as WebSocket);
    setupColorThicknessListeners(canvasContext);
    setupSaveListeners(canvasContext);
  };

  useEffect(() => {
    initializeAll();
    return () => {
      if (!canvas) return;
      removeDocumentListeners(canvas);
      removeColorThicknessListeners(canvas);
      removeSaveListeners(canvas);
      canvas.dispose();
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
