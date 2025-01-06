import { Canvas as FabricCanvas, Rect } from "fabric";
import { useEffect, useRef, useState } from "react";

const setupCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number,
  height: number,
) => {
  console.log(width, height);
  const canvas = new FabricCanvas(canvasElement);
  canvas.setDimensions({ width, height });
  canvas.add(new Rect({ width: 20, height: 20, fill: "#ff0000" }));
  // canvas.backgroundColor = "#ff0000";
  return canvas;
};

export default function Canvas() {
  const canvas = useRef(null);
  const canvasContainer = useRef(null);
  const [context, setContext] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvas.current || !canvasContainer.current) return;
    const style = getComputedStyle(canvasContainer.current);
    const width = parseInt(style.getPropertyValue("width"));
    const height = parseInt(style.getPropertyValue("height"));
    const canvasContext = setupCanvas(canvas.current, width, height);
    setContext(canvasContext);

    return () => {
      console.log("this ran");
      context?.dispose();
      setContext(null);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 20,
        marginTop: "56px",
      }}
      ref={canvasContainer}
    >
      <canvas ref={canvas} />
    </div>
  );
}
