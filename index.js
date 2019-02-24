let img;
let mapImg;
let imageData;
let mouseX;
let mouseY;
let mapData;
let data;
let data2;
const imageCanvas = document.getElementById("imageCanvas");
const mapCanvas = document.getElementById("mapCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const ctxImage = imageCanvas.getContext("2d"); //context object draws on canvas
const ctxMap = mapCanvas.getContext("2d");
const ctxOutput = outputCanvas.getContext("2d");
let outputData = ctxOutput.createImageData(500, 600);
const MAX_MOVEMENT = 10;

function init() {
  img = new Image();
  img.src = "cat.jpg";

  mapImg = new Image();
  mapImg.src = "map.jpg";
  img.addEventListener("load", drawImgToCanvas);
  mapImg.addEventListener("load", drawMapToCanvas);

  document
    .querySelector("#outputCanvas")
    .addEventListener("mousemove", registerMouseMove);
}

init();

function drawImgToCanvas() {
  ctxImage.drawImage(img, 0, 0);

  getImageData();
}

function drawMapToCanvas() {
  ctxMap.drawImage(mapImg, 0, 0);

  getMapData();
}

function getImageData() {
  const w = imageCanvas.width;
  const h = imageCanvas.height;
  imageData = ctxImage.getImageData(0, 0, w, h);
  data = imageData.data;
}

function getMapData() {
  const w = mapCanvas.width;
  const h = mapCanvas.height;
  mapData = ctxImage.getImageData(0, 0, w, h);
  data2 = mapData.data;
  //console.log(data2);
}

function registerMouseMove() {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  //console.log("offset", mouseX, mouseY);
  //calculateRatio(mouseX, mouseY);
  //let [mouseXratio, mouseYratio] = calculateRatio(mouseX, mouseY);
  render();
}

function calculateRatio(x, y) {
  let ratioX = (x / outputCanvas.width) * 2 - 1;
  let ratioY = (y / outputCanvas.height) * 2 - 1;
  //console.log("ratioX", ratioX);
  //console.log("ratioY", ratioY);
  return ratioX, ratioY;
}

function copyPixels(startX, startY) {
  //console.log(ctx);
  const w = ctxZoom.canvas.width;
  const imageW = ctx.canvas.width;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const pixelIndex = (x + y * w) * 4; //small canvas
      const orygPixelIndex = (x + y * w) * 4; //small canvas

      outputData.data[pixelIndex + 0] = imageData.data[orygPixelIndex + 0];
      outputData.data[pixelIndex + 1] = imageData.data[orygPixelIndex + 1];
      outputData.data[pixelIndex + 2] = imageData.data[orygPixelIndex + 2];
      outputData.data[pixelIndex + 3] = imageData.data[orygPixelIndex + 3];
    }
  }
}

function copyDisplacementPixels(startX, startY) {
  const mouseXratio = (startX / outputCanvas.width) * 2 - 1; //Liczy od 0 do 1, ale potrzebne jest od -1 do 1, więc mnoży się przez 2 i wtedy odejmuje się 1 o będzie od -1 do 1
  const mouseYratio = (startY / outputCanvas.height) * 2 - 1;
  let displacementX = MAX_MOVEMENT * mouseXratio; //displacement
  let displacementY = MAX_MOVEMENT * mouseYratio;

  const w = outputCanvas.width;
  //const imageW = ctx.canvas.width;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const pixelIndex = (x + y * w) * 4; //small canvas
      //console.log(x + "|" + y + "|" + w);
      const greyvalue = mapData.data[pixelIndex] / 255;
      offsetX = Math.round(x + displacementX * greyvalue);
      offsetY = Math.round(y + displacementY * greyvalue);
      const originalPixelIndex = (offsetY * w + offsetX) * 4;
      //console.log(greyvalue);
      outputData.data[pixelIndex + 0] = imageData.data[originalPixelIndex + 0];
      outputData.data[pixelIndex + 1] = imageData.data[originalPixelIndex + 1];
      outputData.data[pixelIndex + 2] = imageData.data[originalPixelIndex + 2];
      outputData.data[pixelIndex + 3] = imageData.data[originalPixelIndex + 3];
    }
  }
}

function render() {
  copyDisplacementPixels(mouseX, mouseY);
  //console.log(outputData);
  ctxOutput.putImageData(outputData, 0, 0);
}
