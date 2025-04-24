// @ts-nocheck
import { Canvas } from "fabric";
import { EraserBrush } from "./drawing";

const setColor = (canvas: Canvas, color: string) => {
  if (!canvas.freeDrawingBrush) return;
  if (canvas.freeDrawingBrush instanceof EraserBrush) return;
  canvas.freeDrawingBrush.color = color;
};

const setThickness = (canvas: Canvas, thickness: number) => {
  if (!canvas.freeDrawingBrush) return;
  canvas.freeDrawingBrush.width = thickness;
};

export const setupColorThicknessListeners = (canvas: Canvas) => {
  document.addEventListener("color", (e) => setColor(canvas, e.detail.color));
  document.addEventListener("thickness", (e) =>
    setThickness(canvas, e.detail.thickness),
  );
};

export const removeColorThicknessListeners = (canvas: Canvas) => {
  document.removeEventListener("color", (e) =>
    setColor(canvas, e.detail.color),
  );
  document.removeEventListener("thickness", (e) =>
    setThickness(canvas, e.detail.thickness),
  );
};
