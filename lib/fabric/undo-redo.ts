import { Canvas } from "fabric";

let undoStack: object[] = [];
let redoStack: object[] = [];

export const pushToUndoStack = (changes: object) => {
  undoStack.push(changes);
};

export const setUndoStack = (val: object[]) => (undoStack = val);

export const pushToRedoStack = (changes: object) => {
  redoStack.push(changes);
};

export const setRedoStack = (val: object[]) => (redoStack = val);

const undo = (canvas: Canvas) => {
  if (undoStack.length == 0) return;
  const changes = undoStack.pop();

  canvas.remove(changes);
  canvas.renderAll(0);

  pushToRedoStack(changes);
};

const redo = (canvas: Canvas) => {
  if (redoStack.length == 0) return;

  const changes = redoStack.pop();

  canvas.add(changes);
  canvas.renderAll();

  pushToUndoStack(changes);
  // pop off the redo stack
  //
  // apply change
  //
  // push to undo stack
};

export const setupDocumentListeners = (canvas: Canvas) => {
  document.addEventListener("undo", () => undo(canvas));
  document.addEventListener("redo", () => redo(canvas));
};

export const removeDocumentListeners = (canvas: Canvas) => {
  document.removeEventListener("undo", () => undo(canvas));
  document.removeEventListener("redo", () => redo(canvas));
};
