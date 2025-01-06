import { Canvas, Rect } from "fabric";

export const setupCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number,
  height: number,
) => {
  console.log(width, height);
  const canvas = new Canvas(canvasElement);
  canvas.setDimensions({ width, height });
  canvas.add(new Rect({ width: 20, height: 20, fill: "#ff0000" }));
  return canvas;
};

export const setupCanvasListeners = (canvas: Canvas, socket: WebSocket) => {
  canvas.on("object:added", (e) => {
    socket.send(
      JSON.stringify({
        type: "canvas",
        data: e.target.toJSON(),
      }),
    );
    console.log(e);
  });
};
