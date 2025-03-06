import { compile } from "../../compiler/compile";
import { calcCharge } from "../calcCharge";
import { textFormula } from "../../textBuilder/textFormula";

describe("calcCharge", () => {
  it("Single", () => {
    const expr = compile("NH4^+");
    expect(expr.getMessage()).toBe("");
    expect(calcCharge(expr)).toBe(1.0);
    expect(textFormula(expr, "htmlPoor")).toBe("NH<sub>4</sub><sup>+</sup>");
  });
  it("Expression", () => {
    const expr = compile("2Na^+ + SO4^2-");
    expect(expr.getMessage()).toBe("");
    const agents = expr.getAgents();
    expect(agents).toHaveLength(2);
    const [agent0, agent1] = agents;
    expect(calcCharge(agent0!)).toBe(2.0);
    expect(calcCharge(agent1!)).toBe(-2.0);
    expect(calcCharge(agent0!.nodes[0]!)).toBe(1.0);
    expect(calcCharge(agent1!.nodes[0]!)).toBe(-2.0);

    expect(calcCharge(expr)).toBe(0.0);
  });
  it("Abstract", () => {
    const expr = compile("'n'H^+ + O^--");
    expect(expr.getMessage()).toBe("");
    const agents = expr.getAgents();
    expect(agents).toHaveLength(2);
    expect(calcCharge(agents[0]!)).toBeNaN();
    expect(calcCharge(agents[1]!)).toBe(-2.0);

    expect(calcCharge(expr)).toBeNaN();
  });
  it("SpecialChar", () => {
    const expr = compile("ClO2^\u2212");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.nodes[0]!.charge!.text).toBe("-");
    expect(calcCharge(expr)).toBe(-1.0);
  });
});
