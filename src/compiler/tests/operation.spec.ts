import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { rulesHtml } from "../../textRules/rulesHtml";

describe("operation", () => {
  it("Plus", () => {
    const expr = compile("+");
    expect(expr.getMessage()).toBe("");
    expect(makeTextFormula(expr)).toBe("+");
  });
  it("Equation", () => {
    const expr = compile("Cu + O = CuO");
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(5);
    expect(makeTextFormula(expr)).toBe("Cu + O = CuO");
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
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span class="echem-op"><span class="echem-opcomment">T</span>→</span>`
    );
  });
  it("PostComm", () => {
    const expr = compile('->"[Delta]"');
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span class="echem-op">→<span class="echem-opcomment">Δ</span></span>`
    );
  });
  it("BothComm", () => {
    const expr = compile(` "T"->"-[Delta]" `);
    expect(expr.getMessage()).toBe("");
    expect(expr.entities).toHaveLength(1);
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span class="echem-op"><span class="echem-opcomment">T</span>→<span class="echem-opcomment">-Δ</span></span>`
    );
  });
});
