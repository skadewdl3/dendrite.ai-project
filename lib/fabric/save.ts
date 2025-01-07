import { Canvas } from "fabric";
import { jsPDF } from "jspdf";

const saveAsImg = (canvas: Canvas) => {
  const dataURL = canvas.toDataURL({ format: "png", multiplier: 1 });
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas.png";
  link.click();
};

const saveAsPdf = (canvas: Canvas) => {
  const dataURL = canvas.toDataURL({
    format: "jpeg",
    quality: 1,
    multiplier: 1,
  });
  const pdf = new jsPDF({
    orientation: "landscape",
  });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  pdf.addImage(dataURL, "JPEG", 0, 0, width, height);
  pdf.save("canvas.pdf");
};

export const setupSaveListeners = (canvas: Canvas) => {
  document.addEventListener("save:img", () => saveAsImg(canvas));
  document.addEventListener("save:pdf", () => saveAsPdf(canvas));
};

export const removeSaveListeners = (canvas: Canvas) => {
  document.removeEventListener("save:img", () => saveAsImg(canvas));
  document.removeEventListener("save:pdf", () => saveAsPdf(canvas));
};
