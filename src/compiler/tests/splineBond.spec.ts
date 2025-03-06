import { compile } from "../compile";
import { makeBrutto } from "../../inspectors/makeBrutto";
import { Point, pointFromDeg } from "../../math/Point";
import { lastItem } from "../../utils/lastItem";
import { ChemObj } from "../../core/ChemObj";
import { textFormula } from "../../textBuilder/textFormula";

const toText = (obj: ChemObj): string => textFormula(obj, "text");

const brutto = (obj: ChemObj): string => toText(makeBrutto(obj));

// Основное отличие _o от _s: o рассчитано на правильные многоугольники и всегда рисуется ровным кругом
// s может быть использовано для "сплющенных" циклических структур.

describe("SplineBond", () => {
  it("SplineBondWithoutParams", () => {
    // _s without parameters equals to _o
    const expr = compile("/\\|`/`\\`|_s");
    expect(expr.getMessage()).toBe("");
    expect(brutto(expr)).toBe("C6H6");
  });
  it("SplineBondWithEmptyParamsList", () => {
    //    _____
    //   /     \___
    //   \_____/
    const expr = compile("_(x2)\\<->`/_(x-2)`\\/_s()");
    expect(expr.getMessage()).toBe("");
    const p1 = new Point(2.0, 0.0);
    const p2 = p1.plus(pointFromDeg(60.0));
    const p3 = p2.plus(new Point(1.0, 0.0));
    const p4 = p2.plus(pointFromDeg(120.0));
    const p5 = p4.minus(p1);
    const p6 = p5.plus(pointFromDeg(-120.0));
    expect(expr.getAgents()[0]!.nodes.map((it) => String(it.pt))).toEqual(
      [new Point(), p1, p2, p3, p4, p5, p6].map((p) => String(p))
    );
    expect(brutto(expr)).toBe("C7H8");
    const s = lastItem(expr.getAgents()[0]!.bonds)!;
    expect(s.isCycle).toBe(true);
    expect(s.nodes.map((it) => it?.index)).toEqual([0, 1, 2, 4, 5, 6]);
  });
  it("DashedStyle", () => {
    //    /1\ /3
    //   0   2
    //   | O |
    //   6   4
    //    \5/
    const expr = compile("/\\</>|`/`\\`|_s(S:)");
    expect(expr.getMessage()).toBe("");
    expect(brutto(expr)).toBe("C7H8");
    const s = lastItem(expr.getAgents()[0]!.bonds)!;
    expect(s.style).toBe(":");
    expect(s.nodes.map((it) => it?.index)).toEqual([0, 1, 2, 4, 5, 6]);
    expect(s.isCycle).toBe(true);
  });
  it("NonCycle", () => {
    // 0___1
    //     \2___3
    // 5___/4
    const expr = compile("-\\<->`/`-_s(S:)");
    expect(expr.getMessage()).toBe("");
    const s = lastItem(expr.getAgents()[0]!.bonds)!;
    expect(s.nodes.map((it) => it?.index)).toEqual([0, 1, 2, 4, 5]);
    expect(s.isCycle).toBe(false);
  });
  it("Cycle", () => {
    // 0___1
    //     \2___3
    // 5___/4
    const expr = compile("-\\<->`/`-_s(S:,o)");
    expect(expr.getMessage()).toBe("");
    const s = lastItem(expr.getAgents()[0]!.bonds)!;
    expect(s.nodes.map((it) => it?.index)).toEqual([0, 1, 2, 4, 5]);
    expect(s.isCycle).toBe(true);
  });
  it("AutoCycledNodesList", () => {
    //      *1---2*
    //      /     \
    //     8       3
    //     |       |
    //     7       4
    //      \     /
    //      *6---5*
    const expr = compile("$slope(45)-\\|`/`-`\\`|/_s(#1;2;5;6;1)");
    expect(expr.getMessage()).toBe("");
    const s = lastItem(expr.getAgents()[0]!.bonds)!;
    expect(s.isCycle).toBe(true);
    expect(s.nodes.map((it) => (it?.index ?? -1) + 1)).toEqual([1, 2, 5, 6]);
  });
  it("NonCycledWithIntervals", () => {
    //  1
    // *2\__3*
    //       \4*__5
    //  *7_*6/
    //  8/
    const expr = compile("\\-\\<->`/`-_s(#2:4;6:7,S:)`/");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    const s = bonds[bonds.length - 2]!;
    expect(s.nodes.map((it) => (it?.index ?? -1) + 1)).toEqual([2, 3, 4, 6, 7]);
    expect(s.isCycle).toBe(false);
  });
});
