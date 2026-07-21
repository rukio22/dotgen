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
        const r = src.data[i + 0];
        const g = src.data[i + 1];
        const b = src.data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const mm = max - min;
        let h = 0;
        if (mm !== 0) {
            if (r > g && r > b) {
                h = (g - b) / mm / 6 * 100;
            } else if (g > r && g > b) {
                h = 1 / 3 + (b - r) / mm / 6 * 100;
            } else {
                h = 2 / 3 + (r - g) / mm / 6 * 100;
            }
        }
        let s = 0;
        if (max !== 0) {
            s = mm / max * 100;
        }
        const v = max / 255 * 100;
        dst.push(Math.trunc(h));
        dst.push(Math.trunc(s));
        dst.push(Math.trunc(v));
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

