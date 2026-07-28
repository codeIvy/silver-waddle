export const BINS = 384;

export function sampleColumn(imageData, width, top, bottom, x) {
  const result = new Uint8Array(BINS);
  const height = bottom - top;

  for (let bin = 0; bin < BINS; bin++) {
    const y = Math.round(top + ((bin + 0.5) / BINS) * height);
    const i = (y * width + x) * 4;
    result[bin] = Math.round(
      imageData[i] * 0.299 +
      imageData[i + 1] * 0.587 +
      imageData[i + 2] * 0.114
    );
  }
  return result;
}

export function findDataBand(imageData, width, height) {
  const rowDarkness = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let dark = 0;
    for (let x = 0; x < width; x += 4) {
      const i = (y * width + x) * 4;
      const luma =
        imageData[i] * 0.299 +
        imageData[i + 1] * 0.587 +
        imageData[i + 2] * 0.114;
      dark += 255 - luma;
    }
    rowDarkness[y] = dark;
  }

  const strongest = [...rowDarkness.keys()]
    .sort((a, b) => rowDarkness[b] - rowDarkness[a])
    .slice(0, 24)
    .sort((a, b) => a - b);

  if (strongest.length < 2) return null;

  const top = strongest.find(y => y < height / 2);
  const bottom = [...strongest].reverse().find(y => y > height / 2);

  if (top == null || bottom == null || bottom - top < height * 0.2) {
    return null;
  }

  return { top: top + 12, bottom: bottom - 12 };
}
