import { Canvas, FabricObject, Rect, util } from "fabric";
import { pushToUndoStack } from "./undo-redo";
import { v4 as uuid } from "uuid";

export const setupCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number,
  height: number,
) => {
  console.log(width, height);
  FabricObject.customProperties = ["id"];
  const canvas = new Canvas(canvasElement);
  canvas.setDimensions({ width, height });
  canvas.add(new Rect({ width: 20, height: 20, fill: "#ff0000" }));
  return canvas;
};

let stopEvents = false;
export const setEvents = (enable: boolean) => (stopEvents = !enable);

export const setupCanvasListeners = (canvas: Canvas, socket: WebSocket) => {
  canvas.on("object:added", (e) => {
    if (stopEvents) return;

    // custom ID property for tracking object changes
    e.target.id = uuid();
    pushToUndoStack(e.target);

    socket.send(
      JSON.stringify({
        type: "canvas:add",
        data: e.target.toJSON(),
      }),
    );
    console.log(e.target);
  });

  canvas.on("object:removed", (e) => {
    console.log("this ran", e);
    if (stopEvents) return;
    socket.send(
      JSON.stringify({
        type: "canvas:remove",
        data: e.target.toJSON(),
      }),
    );
  });

  socket.addEventListener("message", async (event) => {
    const message =
      typeof event.data === "string" ? event.data : await event.data.text();

    const { type, data: changes } = JSON.parse(message);
    if (type == "canvas:add") await canvasAdd(canvas, changes);
    else if (type == "canvas:remove") await canvasRemove(canvas, changes);

    // const path = new Path(changes);
  });
};

const canvasAdd = async (canvas: Canvas, changes: object) => {
  const objects = await util.enlivenObjects([changes]);
  setEvents(false);
  objects.forEach((obj) => canvas.add(obj));
  canvas.renderAll();
  setEvents(true);

  console.log("changes: ", changes);
};

const canvasRemove = async (canvas: Canvas, changes: object) => {
  setEvents(false);
  console.log(changes);
  const objects = await util.enlivenObjects([changes]);
  objects.forEach(({ id }) => {
    const toRemove = canvas._objects.find((obj) => obj.id == id);
    if (!toRemove) return;
    canvas.remove(toRemove);
  });
  canvas.renderAll();
  setEvents(true);
};
