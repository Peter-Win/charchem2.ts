import { coeffEnumerator2d } from "../coeffEnumerators";

describe("coeffEnumerator2d", () => {
  it("level=3", () => {
    const iter = coeffEnumerator2d(3);
    const list = Array.from(iter);
    //     1  2  3
    //  1  0  1  3   1,1 1,2 2,1
    //  2  2  4  6   1,3 2,2 3,1
    //  3  5  7  8   2,3 3,2 3,3
    const s = list.map((c) => c.join(",")).join(" ");
    expect(s).toBe("1,1 1,2 2,1 1,3 2,2 3,1 2,3 3,2 3,3");
  });

  it("level=4", () => {
    const iter = coeffEnumerator2d(4);
    const list = Array.from(iter);
    //     1  2  3  4
    //  1  0  1  3  6
    //  2  2  4  7 10
    //  3  5  8 11 13
    //  4  9 12 14 15
    const s = list.map((c) => c.join("")).join(" ");
    //               0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
    expect(s).toBe("11 12 21 13 22 31 14 23 32 41 24 33 42 34 43 44");
  });

  it("level=5", () => {
    const iter = coeffEnumerator2d(5);
    const list = Array.from(iter);
    //     1  2  3  4  5
    //  1  0  1  3  6 10
    //  2  2  4  7 11 15
    //  3  5  8 12 16 19
    //  4  9 13 17 20 22
    //  5 14 18 21 23 24
    const s = list.map((c) => c.join("")).join(" ");
    //               0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
    expect(s).toBe(
      "11 12 21 13 22 31 14 23 32 41 15 24 33 42 51 25 34 43 52 35 44 53 45 54 55"
    );
  });
});
