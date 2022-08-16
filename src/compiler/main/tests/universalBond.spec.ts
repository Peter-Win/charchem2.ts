import { createTestCompiler } from "../../ChemCompiler";
import {
  calcBondDirection,
  calcPolygonDir,
  makeParamsDict,
  parseBondMultiplicity,
} from "../bondUniversal";
import { ChemBond } from "../../../core/ChemBond";
import { Point } from "../../../math/Point";

describe("Universal bond", () => {
  it("makeParamsDict", () => {
    expect(makeParamsDict([], [])).toEqual({});
    expect(makeParamsDict(["x1", "y-1"], [0, 9])).toEqual({
      x: { key: "x", value: "1", valuePos: 1 }, // value position = arg position + 1
      y: { key: "y", value: "-1", valuePos: 10 },
    });
    expect(makeParamsDict(["", "a0"], [2, 4])).toEqual({
      a: { key: "a", value: "0", valuePos: 5 },
    });
    expect(makeParamsDict(["Crgb(255,0,0)"], [11])).toEqual({
      C: { key: "C", value: "rgb(255,0,0)", valuePos: 12 },
    });
  });
  it("calcBondDirection", () => {
    const compiler = createTestCompiler("");
    // _(A90)
    expect(
      calcBondDirection(compiler, {
        A: { key: "A", value: "90", valuePos: 22 },
      }).toString()
    ).toBe("(0, 1)");
    // _(A180,L1.5)
    expect(
      calcBondDirection(compiler, {
        A: { key: "A", value: "180", valuePos: 33 },
        L: { key: "L", value: "1.5", valuePos: 44 },
      }).toString()
    ).toBe("(-1.5, 0)");
    // _(x.7,y-.9)
    expect(
      calcBondDirection(compiler, {
        x: { key: "x", value: ".7", valuePos: 2 },
        y: { key: "y", value: "-.9", valuePos: 3 },
      }).toString()
    ).toBe("(0.7, -0.9)");
  });
  it("parseBondMultiplicity 2", () => {
    const compiler = createTestCompiler("");
    const bond1 = new ChemBond();
    parseBondMultiplicity(compiler, bond1, {
      key: "N",
      value: "2",
      valuePos: 1,
    });
    expect(bond1?.n).toBe(2.0);
    expect(bond1?.align).toBeUndefined();
  });
  it("parseBondMultiplicity 1.5", () => {
    const compiler = createTestCompiler("");
    const bond15 = new ChemBond();
    parseBondMultiplicity(compiler, bond15, {
      key: "N",
      value: "1.5",
      valuePos: 1,
    });
    expect(bond15?.n).toBe(1.5);
    expect(bond15.align).toBeUndefined();
  });
  it("parseBondMultiplicity X", () => {
    const compiler = createTestCompiler("");
    const bondX = new ChemBond();
    parseBondMultiplicity(compiler, bondX, {
      key: "N",
      value: "2x",
      valuePos: 2,
    });
    expect(bondX?.n).toBe(2.0);
    expect(bondX?.align).toBe("x");
    expect(bondX?.isCross()).toBe(true);
  });
  it("parseBondMultiplicity L", () => {
    const compiler = createTestCompiler("");
    const bondL = new ChemBond();
    parseBondMultiplicity(compiler, bondL, {
      key: "N",
      value: "2L",
      valuePos: 3,
    });
    expect(bondL?.n).toBe(2.0);
    expect(bondL?.align).toBe("l");
  });
  it("parseBondMultiplicity R", () => {
    const compiler = createTestCompiler("");
    const bondR = new ChemBond();
    parseBondMultiplicity(compiler, bondR, {
      key: "N",
      value: "2r",
      valuePos: 4,
    });
    expect(bondR?.n).toBe(2.0);
    expect(bondR?.align).toBe("r");
  });
  it("parseBondMultiplicity M", () => {
    const compiler = createTestCompiler("");
    const bondM = new ChemBond();
    parseBondMultiplicity(compiler, bondM, {
      key: "N",
      value: "2M",
      valuePos: 5,
    });
    expect(bondM?.n).toBe(2.0);
    expect(bondM?.align).toBe("m");
  });
  it("calcPolygonDir", () => {
    expect(calcPolygonDir(new Point(1, 0), 4).toString()).toBe("(0, 1)");
    expect(calcPolygonDir(new Point(2, 0), -4).toString()).toBe("(0, -2)");
    expect(
      calcPolygonDir(new Point(Math.sqrt(3.0) / 2, -0.5), 3).toString()
    ).toBe("(0, 1)");
  });
});
