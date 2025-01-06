import { PencilBrush, Canvas } from "fabric";

class EraserBrush extends PencilBrush {
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

  console.log("setting tool to: ", mode);
  if (mode == "pencil") {
    canvas.freeDrawingBrush = new PencilBrush(canvas);
  } else {
    canvas.freeDrawingBrush = new EraserBrush(canvas);
  }
  canvas.freeDrawingBrush.color = "#ff0000";
  canvas.freeDrawingBrush.width = 5;

  console.log(enable, canvas.freeDrawingBrush);
};
