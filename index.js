const imageInput = document.getElementById('imageInput');

const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext("2d");

const range = document.getElementById('pixelRange');

const pixelDataOutput = document.getElementById('pixelDataOutput');

const copyButton = document.getElementById('copyButton');

const img = new Image();

function reload() {
    if (!img.src) return;

    const w = img.width;
    const h = img.height;
    const ave = range.value;
    const dw = w / ave;
    const dh = h / ave;
    previewCanvas.width = dw;
    previewCanvas.height = dh;
    ctx.drawImage(img, 0, 0, dw, dh);

    const src = ctx.getImageData(0, 0, dw, dh);
    const dst = [];
    for (let i = 0; i < src.data.length; i += 4) {
        dst.push(Math.trunc(src.data[i + 0] / 255 * 100));
        dst.push(Math.trunc(src.data[i + 1] / 255 * 100));
        dst.push(Math.trunc(src.data[i + 2] / 255 * 100));
    }

    pixelDataOutput.value = dst.toString();
}

imageInput.addEventListener('change', (_) => {
    const file = imageInput.files[0];
    if (!file) return;

    img.src = URL.createObjectURL(file);
    img.onload = reload;
});
range.addEventListener('change', (_) => reload())

copyButton.addEventListener('click', (_) => navigator.clipboard.writeText(pixelDataOutput.value));

