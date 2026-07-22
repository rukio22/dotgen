const imageInput = document.getElementById('imageInput');

const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext("2d");

const range = document.getElementById('pixelRange');

const pixelDataOutput = document.getElementById('pixelDataOutput');

const startRow = document.getElementById('copyStartRow');
const rowCount = document.getElementById('copyRowCount');

const startRowMinus = document.getElementById('copyStartRowMinus');
const startRowPlus = document.getElementById('copyStartRowPlus');
const rowCountMinus = document.getElementById('copyRowCountMinus');
const rowCountPlus = document.getElementById('copyRowCountPlus');

const copyButton = document.getElementById('copyButton');

const img = new Image();

function reload() {
    if (!img.src) return;

    const w = img.width;
    const h = img.height;
    const ave = range.value;
    const dw = Math.trunc(w / ave);
    const dh = Math.trunc(h / ave);
    previewCanvas.width = dw;
    previewCanvas.height = dh;
    ctx.drawImage(img, 0, 0, dw, dh);

    const start = Math.trunc(copyStartRow.value);
    const count = Math.trunc(copyRowCount.value);
    const src = ctx.getImageData(0, 0, dw, dh);
    const dst = [];
    for (let i = start * dw * 4; i < (start + count) * dw * 4 && i < src.data.length; i += 4) {
        const r = src.data[i + 0];
        const g = src.data[i + 1];
        const b = src.data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const mm = max - min;
        let h = 0;
        if (mm !== 0) {
            if (r > g && r > b) {
                h = ((g - b) / mm / 6) * 100;
            } else if (g > r && g > b) {
                h = (1 / 3 + (b - r) / mm / 6) * 100;
            } else {
                h = (2 / 3 + (r - g) / mm / 6) * 100;
            }
        }
        if (h < 0) {
            h += 100;
        }
        let s = 0;
        if (max !== 0) {
            s = mm / max * 100;
        }
        const v = max / 255 * 100;
        dst.push(Math.trunc(h).toString().padStart(3, '0'));
        dst.push(Math.trunc(s).toString().padStart(3, '0'));
        dst.push(Math.trunc(v).toString().padStart(3, '0'));
        if ((i / 4) % dw === dw - 1) {
            dst.push('rrr');
        }
    }

    pixelDataOutput.value = dst.toString().replaceAll(',', '');
}

imageInput.addEventListener('change', (_) => {
    const file = imageInput.files[0];
    if (!file) return;

    img.src = URL.createObjectURL(file);
    img.onload = reload;
});
range.addEventListener('change', (_) => reload())
startRow.addEventListener('change', (_) => reload())
rowCount.addEventListener('change', (_) => reload())
startRowMinus.addEventListener('click', (_) => reload());
startRowPlus.addEventListener('click', (_) => reload());
rowCountMinus.addEventListener('click', (_) => reload());
rowCountPlus.addEventListener('click', (_) => reload());

copyButton.addEventListener('click', (_) => navigator.clipboard.writeText(pixelDataOutput.value));

