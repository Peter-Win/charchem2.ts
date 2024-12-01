import { ChemExpr } from "../../../core/ChemExpr";
import { compile } from "../../compile";
import { getSrcItemsForObject } from "../getSrcItemsForObject";
import { SrcMapItem } from "../SrcMapItem";

const getTextFromMap = (expr: ChemExpr, mapItem: SrcMapItem): string =>
  expr.src.slice(mapItem.begin, mapItem.end);

describe("bondSrcMap", () => {
  it("simple bond", () => {
    const expr = compile("H||H", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[0]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(1);
    expect(d[0]!.end).toBe(3);
    expect(getTextFromMap(expr, d[0]!)).toBe("||");
  });
  it("simple bond with suffix", () => {
    const expr = compile("H/hvvvH", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[0]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(1);
    expect(d[0]!.end).toBe(6);
    expect(getTextFromMap(expr, d[0]!)).toBe("/hvvv");
  });
  it("universal bond", () => {
    //                    012345678901234
    const expr = compile("H2C_(x1,y1,N2)CH2", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[0]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(3);
    expect(d[0]!.end).toBe(14);
    expect(getTextFromMap(expr, d[0]!)).toBe("_(x1,y1,N2)");
  });
  it("universal bond without params", () => {
    //                    012345
    const expr = compile("-|_#1", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[2]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(2);
    expect(d[0]!.end).toBe(3);
    expect(getTextFromMap(expr, d[0]!)).toBe("_");
  });
  it("polygonal bond", () => {
    //                    012345
    const expr = compile("-_pp6OH", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[1]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(1);
    expect(d[0]!.end).toBe(5);
    expect(getTextFromMap(expr, d[0]!)).toBe("_pp6");
  });
  it("polygonal bond with suffix", () => {
    //                    012345
    const expr = compile("-_pww_p", { srcMap: true });
    const bond = expr.getAgents()[0]?.bonds[1]!;
    expect(bond).toBeDefined(); // Bond must be defined
    const d = getSrcItemsForObject(bond, expr.srcMap);
    expect(d.length).toBe(1);
    expect(d[0]!.begin).toBe(1);
    expect(d[0]!.end).toBe(5);
    expect(getTextFromMap(expr, d[0]!)).toBe("_pww");
  });
});
