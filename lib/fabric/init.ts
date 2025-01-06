import { Canvas, Path, Rect, util } from "fabric";

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
  let stopEvents = false;
  canvas.on("object:added", (e) => {
    if (stopEvents) return;
    socket.send(
      JSON.stringify({
        type: "canvas",
        data: e.target.toJSON(),
      }),
    );
    console.log(e);
  });

  socket.addEventListener("message", async (event) => {
    const message =
      typeof event.data === "string" ? event.data : await event.data.text();

    const { type, data: changes } = JSON.parse(message);
    if (type != "canvas") return;

    // const path = new Path(changes);
    const objects = await util.enlivenObjects([changes]);
    stopEvents = true;
    objects.forEach((obj) => canvas.add(obj));
    canvas.renderAll();
    stopEvents = false;

    console.log("changes: ", changes);
  });
};
