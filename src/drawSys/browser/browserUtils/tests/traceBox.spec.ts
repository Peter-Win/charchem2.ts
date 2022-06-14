import { traceBox } from "../traceBox";

const makeImage = (textImg: string) => {
  const rows = textImg.split("\n");
  const height = rows.length;
  const width = rows.reduce((best, row) => Math.max(best, row.length), 0);
  const data = new Uint8ClampedArray(height * width * 4);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rows[y]![x] === "#") {
        data[pos++] = 0xff;
        data[pos++] = 0xff;
        data[pos++] = 0xff;
        data[pos++] = 0xff;
      } else {
        pos += 4;
      }
    }
  }
  return { width, height, data };
};

it("makeImage", () => {
  const img3x2 = `#.#
.#`;
  const F = [255, 255, 255, 255];
  const o = [0, 0, 0, 0];
  expect(makeImage(img3x2)).toEqual({
    width: 3,
    height: 2,
    data: new Uint8ClampedArray([...F, ...o, ...F, ...o, ...F, ...o]),
  });
});

const zImg = `0
1
2 ##### 4
3    #  3
4   #   2
5  #    1
6 ##### 0
7
8`;

const eImg = `0
1
2
3     ##    4
4  ###  ##  3
5 ######### 2
6  ##       1
7   #####   0
8
9
`;
const fImg = `0    ##
1   #  #
2   #
3  ####
4   #
5   #
6   #   `;

const yxImg = `0
1  #      # #   #
2   #    #   # #
3    #  #     #
4    # #     # #
5 ____#_____#___#_
6 #  #
7  ##
`;

describe("traceBox", () => {
  it("xHeight", () => {
    const { width, height, data } = makeImage(zImg);
    const top = traceBox(data, width, height, true);
    expect(top).toBe(2);
    const bottom = traceBox(data, width, height, false);
    expect(bottom).toBe(6);
    const xHeight = bottom! - top!;
    expect(xHeight).toBe(4);
  });
  it("capHeight", () => {
    const { width, height, data } = makeImage(eImg);
    const top = traceBox(data, width, height, true);
    expect(top).toBe(3);
    const bottom = traceBox(data, width, height, false);
    expect(bottom).toBe(7);
    const capHeight = bottom! - top!;
    expect(capHeight).toBe(4);
  });
  it("ascent", () => {
    const { width, height, data } = makeImage(fImg);
    const top = traceBox(data, width, height, true);
    expect(top).toBe(0);
    const bottom = traceBox(data, width, height, false);
    expect(bottom).toBe(6);
    const ascent = bottom! - top!;
    expect(ascent).toBe(6);
  });
  it("descent", () => {
    const { width, height, data } = makeImage(yxImg);
    const baseline = 5;
    const bottom = traceBox(data, width, height, false);
    expect(bottom).toBe(7);
    const descent = baseline - bottom!;
    expect(descent).toBe(-2);
  });
});
