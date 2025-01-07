import { PencilBrush, Canvas } from "fabric";

export class EraserBrush extends PencilBrush {
  globalCompositeOperation: string = "";

  constructor(canvas: Canvas) {
    super(canvas);
    this.globalCompositeOperation = "destination-out";
  }

  createPath(pathData: any) {
    const path = super.createPath(pathData);
    path.globalCompositeOperation = this
      .globalCompositeOperation as GlobalCompositeOperation;
    return path;
  }
}

let prevBrush = null;

export const setFreeDrawing = (
  canvas: Canvas,
  enable: boolean,
  mode: "pencil" | "eraser" = "pencil",
) => {
  canvas.isDrawingMode = enable;
  if (!enable) {
    canvas.freeDrawingBrush = undefined;
    return;
  }

  prevBrush = canvas.freeDrawingBrush;
  if (mode == "pencil") {
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    if (!prevBrush) return;
    canvas.freeDrawingBrush.width = prevBrush.width;
    canvas.freeDrawingBrush.color = prevBrush.color;
  } else {
    canvas.freeDrawingBrush = new EraserBrush(canvas);
    if (!prevBrush) return;
    canvas.freeDrawingBrush.width = prevBrush.width;
    canvas.freeDrawingBrush.color = "#ffffff";
  }
  console.log(enable, canvas.freeDrawingBrush);
};
