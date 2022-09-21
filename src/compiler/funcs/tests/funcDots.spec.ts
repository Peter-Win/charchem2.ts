import { compile } from "../../compile";
import { createTestCompiler } from "../../ChemCompiler";
import {
  parseDotsArgs,
  parseSingleDotArg,
  splitDotPositions,
} from "../funcDots";
import { ChemNodeItem } from "../../../core/ChemNodeItem";

describe("funcDots", () => {
  it("splitCompact", () => {
    expect(splitDotPositions("!")).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(splitDotPositions("!R").sort()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(splitDotPositions("R")).toEqual([0, 7]);
    expect(splitDotPositions("Rb")).toEqual([0]);
    expect(splitDotPositions("Rd")).toEqual([0]);
    expect(splitDotPositions("Rt")).toEqual([7]);
    expect(splitDotPositions("Ru")).toEqual([7]);

    expect(splitDotPositions("L")).toEqual([3, 4]);
    expect(splitDotPositions("Lb")).toEqual([3]);
    expect(splitDotPositions("Ld")).toEqual([3]);
    expect(splitDotPositions("Lt")).toEqual([4]);
    expect(splitDotPositions("Lu")).toEqual([4]);

    expect(splitDotPositions("U")).toEqual([5, 6]);
    expect(splitDotPositions("T")).toEqual([5, 6]);
    expect(splitDotPositions("Ul")).toEqual([5]);
    expect(splitDotPositions("Tl")).toEqual([5]);
    expect(splitDotPositions("Ur")).toEqual([6]);
    expect(splitDotPositions("Tr")).toEqual([6]);

    expect(splitDotPositions("D")).toEqual([1, 2]);
    expect(splitDotPositions("B")).toEqual([1, 2]);
    expect(splitDotPositions("Dl")).toEqual([2]);
    expect(splitDotPositions("Bl")).toEqual([2]);
    expect(splitDotPositions("Dr")).toEqual([1]);
    expect(splitDotPositions("Br")).toEqual([1]);

    expect(splitDotPositions("UDLR")).toEqual([5, 6, 1, 2, 3, 4, 0, 7]);
    expect(splitDotPositions("RbDrBlLdLtUlTrRu")).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
  });
  it("parseSingleDotArg", () => {
    const com = createTestCompiler("");
    expect(parseSingleDotArg(com, "LR", 0)).toEqual({
      cmd: "dirs",
      dirs: [3, 4, 0, 7],
    });
    expect(parseSingleDotArg(com, "c:red", 0)).toEqual({
      cmd: "color",
      color: "red",
    });
    expect(parseSingleDotArg(com, "c:", 0)).toEqual({
      cmd: "color",
      color: undefined,
    });
    expect(parseSingleDotArg(com, "-90", 0)).toEqual({ cmd: "num", num: -90 });
    expect(parseSingleDotArg(com, "%x:22", 0)).toEqual({ cmd: "num", num: 22 });
    expect(parseSingleDotArg(com, "%x", 0)).toEqual({ cmd: "num", num: 22 });
  });
  it("parseDotsArgs", () => {
    const com = createTestCompiler("");
    expect(parseDotsArgs(com, ["c:yellow", "L", "c:", "180"], [0, 0])).toEqual([
      { pos: 3, color: "yellow" },
      { pos: 4, color: "yellow" },
      { angle: 180 },
    ]);
    expect(parseDotsArgs(com, ["!"], [0])).toEqual([
      { pos: 0 },
      { pos: 1 },
      { pos: 2 },
      { pos: 3 },
      { pos: 4 },
      { pos: 5 },
      { pos: 6 },
      { pos: 7 },
    ]);
  });
  it("$dots()", () => {
    const expr = compile("$dots(c:blue,UD)ClO$dots(-90,90)H");
    expect(expr.getMessage()).toBe("");
    const items: ChemNodeItem[] = [];
    expr.walk({
      itemPre(obj) {
        items.push(obj);
      },
    });
    expect(items.length).toBe(3);
    expect(items[0]!.dots).toEqual([
      { pos: 5, color: "blue" },
      { pos: 6, color: "blue" },
      { pos: 1, color: "blue" },
      { pos: 2, color: "blue" },
    ]);
    expect(items[1]!.dots).toBeUndefined();
    expect(items[2]!.dots).toEqual([{ angle: -90 }, { angle: 90 }]);
  });
});
