type Int = number;
export const traceBox = (
  pixels: Uint8ClampedArray,
  width: Int,
  height: Int,
  toBottom: boolean
) => {
  const [start, finish, step] = toBottom
    ? [0, height, 1]
    : [height - 1, -1, -1];
  let best: Int | null = null;
  for (let x = 0; x < width; x++) {
    for (let y = start; y !== finish; y += step) {
      const offset = (y * width + x) * 4 + 3;
      if (pixels[offset]! > 128) {
        if (best !== null) {
          if (toBottom) {
            if (y > best) return best;
          } else if (y < best) return best;
        }
        best = y;
        break;
      }
    }
  }
  return best;
};
