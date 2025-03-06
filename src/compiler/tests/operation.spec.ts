import { compile } from "../compile";
import { textFormula } from "../../textBuilder/textFormula";

describe("operation", () => {
  it("Plus", () => {
    const expr = compile("+");
    expect(expr.getMessage()).toBe("");
    expect(textFormula(expr, "text")).toBe("+");
  });
  it("Equation", () => {
    const expr = compile("Cu + O = CuO");
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(5);
    expect(textFormula(expr, "text")).toBe("Cu + O = CuO");
    const agents = expr.getAgents();
    expect(agents).toHaveLength(3);
    expect(agents[0]!.part).toBe(0);
    expect(agents[1]!.part).toBe(0);
    expect(agents[2]!.part).toBe(1);
  });
  it("PreComm", () => {
    const expr = compile(' "T"->');
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(textFormula(expr, "htmlPoor")).toBe(`T→`);
  });
  it("PostComm", () => {
    const expr = compile('->"[Delta]"');
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(textFormula(expr, "htmlPoor")).toBe(`→Δ`);
  });
  it("BothComm", () => {
    const expr = compile(` "T"->"-[Delta]" `);
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(
      textFormula(expr, {
        type: "htmlPoor",
        options: { opComments: "script" },
      })
    ).toBe(`<sup>T</sup>→<sub>-Δ</sub>`);
  });
});
