import { Int } from "../../types";
import { coeffEnumeratorNd } from "../coeffEnumerators";

const a2s = (it: Generator<Int[]> | Int[][]): string =>
  Array.from(it)
    .map((vec: Int[]) => vec.join(""))
    .join(" ");

const a2r = (it: Generator<Int[]> | Int[][]): string[] => {
  const r = Array.from(it).map((vec: Int[]) => vec.join(""));
  r.sort();
  return r;
};

const fullNd = (dimension: Int, level: Int): Int[][] => {
  const res: Int[][] = [];
  const counters: Int[] = new Array(dimension);
  counters.fill(1);
  for (;;) {
    res.push([...counters]);
    let i = 0;
    while (i < dimension) {
      counters[i]++;
      if (counters[i]! <= level) break;
      counters[i] = 1;
      i++;
    }
    if (i === dimension) break;
  }
  return res;
};

describe("coeffEnumeratorNd", () => {
  it("level=1", () => {
    expect(a2s(coeffEnumeratorNd(5, 1))).toBe("11111");
  });
  it("level=2", () => {
    const a = Array.from(coeffEnumeratorNd(4, 2));
    expect(a2s(a)).toBe(
      "1111 2111 1211 2211 1121 2121 1221 2221 1112 2112 1212 2212 1122 2122 1222 2222"
    );
    const rb = a2r(fullNd(4, 2));
    expect(a2r(a)).toEqual(rb);
  });
  it("level=3", () => {
    const a = Array.from(coeffEnumeratorNd(3, 3));
    // expect(a2s(a)).toBe("");
    const rb = a2r(fullNd(3, 3));
    expect(a2r(a)).toEqual(rb);
  });
  it("level=4", () => {
    const a = Array.from(coeffEnumeratorNd(4, 5));
    const rb = a2r(fullNd(4, 5));
    expect(a2r(a)).toEqual(rb);
  });
  it("level=5", () => {
    const a = Array.from(coeffEnumeratorNd(5, 4));
    const rb = a2r(fullNd(5, 4));
    expect(a2r(a)).toEqual(rb);
  });
});
