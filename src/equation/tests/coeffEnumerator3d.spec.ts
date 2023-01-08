import { Int } from "../../types";
import { coeffEnumerator3d } from "../coeffEnumerators";

const a2s = (it: Generator<Int[]> | Int[][]): string =>
  Array.from(it)
    .map((vec: Int[]) => vec.join(""))
    .join(" ");

const a2r = (it: Generator<Int[]> | Int[][]): string[] => {
  const r = Array.from(it).map((vec: Int[]) => vec.join(""));
  r.sort();
  return r;
};

const full3d = (level: Int): Int[][] => {
  const res: Int[][] = [];
  for (let z = 1; z <= level; z++) {
    for (let y = 1; y <= level; y++) {
      for (let x = 1; x <= level; x++) {
        res.push([z, y, x]);
      }
    }
  }
  return res;
};

describe("coeffEnumerator3d", () => {
  it("level=1", () => {
    const list = Array.from(coeffEnumerator3d(1));
    expect(list).toEqual([[1, 1, 1]]);
    expect(full3d(1)).toEqual(list);
  });
  it("level=2", () => {
    const str = a2s(coeffEnumerator3d(2));
    expect(str).toBe("111 112 121 211 122 221 212 222");
  });

  it("level=3", () => {
    const a = Array.from(coeffEnumerator3d(3));
    const str = a2s(a);
    //                0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17
    expect(str).toBe(
      "111 112 121 211 113 122 131 221 311 212 222 123 132 231 321 312 213 133 232 331 322 313 223 233 332 323 333"
    );
    expect(a.length).toBe(3 * 3 * 3);

    const ra = a2r(a);
    const rb = a2r(full3d(3));
    expect(rb).toEqual(ra);
  });

  it("level=4", () => {
    const a = Array.from(coeffEnumerator3d(4));
    expect(a.length).toBe(4 * 4 * 4);
    const str = a2s(a.slice(0, a.length / 2));
    //                0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31
    expect(str).toBe(
      "111 112 121 211 113 122 131 221 311 212 114 123 132 141 231 321 411 312 213 124 133 142 241 331 421 412 313 214 222 223 232 322"
    );
    const ra = a2r(a);
    const rb = a2r(full3d(4));
    expect(ra).toEqual(rb);
  });

  it("level=5", () => {
    const a = Array.from(coeffEnumerator3d(5));
    expect(a.length).toBe(5 * 5 * 5);
    const ra = a2r(a);
    const rb = a2r(full3d(5));
    expect(ra).toEqual(rb);
  });

  it("level=6", () => {
    const a = Array.from(coeffEnumerator3d(6));
    expect(a.length).toBe(6 * 6 * 6);
    const ra = a2r(a);
    const rb = a2r(full3d(6));
    expect(ra).toEqual(rb);
  });
});
