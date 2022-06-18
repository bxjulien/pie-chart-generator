import html2canvas from "html2canvas";

const exportImage = (ref, name) => {
  if (!ref) {
    throw new Error('Pass a correct ref.')
  }

  html2canvas(ref).then(canvas => {
    let croppedCanvas = document.createElement("canvas");
    let croppedCanvasContext = croppedCanvas.getContext("2d");

    const cropPositionTop = 0;
    const cropPositionLeft = 0;
    const cropWidth = canvas.width;
    const cropHeight = canvas.height;

    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);

    const a = document.createElement("a");
    a.href = croppedCanvas.toDataURL();
    a.download = `${name}.png`;
    a.click();
  });
}

export default exportImage;