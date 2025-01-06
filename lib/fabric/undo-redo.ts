import { Canvas } from "fabric";

const undoStack: object[] = [];
const redoStack: object[] = [];

export const pushToUndoStack = (changes: object) => {
  undoStack.push(changes);
};

export const pushToRedoStack = (changes: object) => {
  redoStack.push(changes);
};

const undo = (canvas: Canvas) => {
  console.log("undoing", undoStack);
  if (undoStack.length == 0) return;
  const changes = undoStack.pop();

  canvas.remove(changes);
  canvas.renderAll(0);

  pushToRedoStack(changes);
};

const redo = (canvas: Canvas) => {
  console.log("redoing", redoStack);
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
