import { Locant, locantPieceToChunk } from "./Locant";

test("locantPieceToChunk", () => {
  expect(locantPieceToChunk({ value: 1 })).toEqual({ text: "1" });
  expect(locantPieceToChunk({ value: 3, primed: 2 })).toEqual({ text: "3′′" });
  expect(locantPieceToChunk({ value: "N", markup: "italic" })).toEqual({
    text: "N",
    markup: "italic",
  });
});

describe("Locant", () => {
  it("constructor", () => {
    expect(
      new Locant([
        { value: "N", markup: "italic" },
        { value: 3, markup: "super" },
      ]).toString()
    ).toBe("<i>N</i><sup>3</sup>");
    expect(
      new Locant([{ value: 4 }, { value: "a", primed: 1 }]).toString()
    ).toBe("4a′");
  });
  it("create", () => {
    expect(Locant.create(3).toString()).toBe("3");
    expect(Locant.create(1, 2).toString()).toBe("1′′");
    expect(Locant.create("N").toString()).toBe("<i>N</i>");
    expect(Locant.create("3a").toString()).toBe("3a");
  });
  // P-14.3.5
  it("less", () => {
    // <i>N</i> < α
    const [x1, x2] = [Locant.create("N"), Locant.create("α")];
    expect(`${x1} < ${x2}`).toBe("<i>N</i> < α");
    expect(x1.less(x2)).toBe(true);
    expect(x2.less(x1)).toBe(false);
    // α < 1
    const [y1, y2] = [Locant.create("α"), Locant.create(1)];
    expect(`${y1} < ${y2}`).toBe("α < 1");
    expect(y1.less(y2)).toBe(true);
    expect(y2.less(y1)).toBe(false);
    // 2 is lower than 2′
    const [a1, a2] = [Locant.create(2), Locant.create(2, 1)];
    expect(`${a1} < ${a2}`).toBe("2 < 2′");
    expect(a1.less(a2)).toBe(true);
    expect(a2.less(a1)).toBe(false);
    // 3 is lower than 3a
    const [b1, b2] = [Locant.create(3), Locant.create("3a")];
    expect(`${b1} < ${b2}`).toBe("3 < 3a");
    expect(b1.less(b2)).toBe(true);
    expect(b2.less(b1)).toBe(false);
    // 8a is lower than 8b
    const [c1, c2] = [Locant.create("8a"), Locant.create("8b")];
    expect(`${c1} < ${c2}`).toEqual("8a < 8b");
    expect(c1.less(c2)).toBe(true);
    expect(c2.less(c1)).toBe(false);
    // 4′ is lower than 4a
    const [d1, d2] = [Locant.create(4, 1), Locant.create("4a")];
    expect(`${d1} < ${d2}`).toBe("4′ < 4a");
    expect(d1.less(d2)).toBe(true);
    expect(d2.less(d1)).toBe(false);
    // 4a is lower than 4′a
    const [e1, e2] = [
      Locant.create("4a"),
      new Locant([{ value: 4, primed: 1 }, { value: "a" }]),
    ];
    expect(`${e1} < ${e2}`).toBe("4a < 4′a");
    expect(e1.less(e2)).toBe(true);
    expect(e2.less(e1)).toBe(false);
    // 1² is lower than 1³
    const f1 = new Locant([{ value: 1 }, { value: 2, markup: "super" }]);
    const f2 = new Locant([{ value: 1 }, { value: 3, markup: "super" }]);
    expect(`${f1} < ${f2}`).toBe("1<sup>2</sup> < 1<sup>3</sup>");
    expect(f1.less(f2)).toBe(true);
    expect(f2.less(f1)).toBe(false);
    // 1⁴ is lower than 2′
    const [g1, g2] = [
      new Locant([{ value: 1 }, { value: 4, markup: "super" }]),
      Locant.create(2, 1),
    ];
    expect(`${g1} < ${g2}`).toBe("1<sup>4</sup> < 2′");
    expect(g1.less(g2)).toBe(true);
    expect(g2.less(g1)).toBe(false);
    // 3a is lower than 3a¹
    const [h1, h2] = [
      Locant.create("3a"),
      new Locant([{ value: 3 }, { value: "a" }, { value: 1, markup: "super" }]),
    ];
    expect(`${h1} < ${h2}`).toBe("3a < 3a<sup>1</sup>");
    expect(h1.less(h2)).toBe(true);
    expect(h2.less(h1)).toBe(false);
  });
});
