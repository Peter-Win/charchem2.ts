import { compile } from "../compile";
import { Point } from "../../math/Point";
import { textFormula } from "../../textBuilder/textFormula";
import { makeBrutto } from "../../inspectors/makeBrutto";

describe("ParseNum", () => {
  it("UseVariable", () => {
    const expr = compile(
      "_(x%width:1.2)_(y-%height:0.9)_(x-%width)_(y%height)"
    );
    expect(expr.getMessage()).toBe("");
    const w = 1.2;
    const h = 0.9;
    expect(expr.getAgents()[0]!.nodes.map((it) => it.pt.toString())).toEqual(
      [
        new Point(),
        new Point(w, 0.0),
        new Point(w, -h),
        new Point(0.0, -h),
      ].map((p) => String(p))
    );
    expect(textFormula(makeBrutto(expr), "text")).toBe("C4H8");
  });
  it("InvalidVariable", () => {
    const expr = compile("_(x%)");
    expect(expr.getMessage("ru")).toBe(
      "Не определена числовая переменная '' в позиции 5"
    );
  });
  it("UnusedVariable", () => {
    const expr = compile("_(A%phi)");
    expect(expr.getMessage("ru")).toBe(
      "Не определена числовая переменная 'phi' в позиции 5"
    );
  });
  it("EmptyVariable", () => {
    const expr = compile("_(A-%:90)");
    expect(expr.getMessage("ru")).toBe(
      "Требуется указать имя переменной в позиции 6"
    );
  });
  it("InvalidVariableValue", () => {
    const expr = compile("_(a%Angle:ABC)");
    expect(expr.getMessage("ru")).toBe(
      "Неверное числовое значение ABC в позиции 11"
    );
  });
  it("Const", () => {
    //     /\
    //   /    \
    // |        |
    // |________|
    const expr = compile("_(x$32,y.5)|_(x-$3)`|/");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(makeBrutto(expr), "text")).toBe("C5H10");
    const bonds = Array.from(expr.getAgents()[0]!.bonds);
    expect(bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))).toEqual([
      30, 90, 180, -90, -30,
    ]);
    expect(expr.getAgents()[0]!.nodes.map((it) => String(it.pt))).toEqual(
      [
        new Point(),
        new Point(Math.sqrt(3.0) / 2, 0.5),
        new Point(Math.sqrt(3.0) / 2, 1.5),
        new Point(-Math.sqrt(3.0) / 2, 1.5),
        new Point(-Math.sqrt(3.0) / 2, 0.5),
      ].map((p) => String(p))
    );
  });
});
