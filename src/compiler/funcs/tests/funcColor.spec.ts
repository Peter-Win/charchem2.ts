import { makeTextFormula } from "../../../inspectors/makeTextFormula";
import { ChemNodeItem } from "../../../core/ChemNodeItem";
import { compile } from "../../compile";

describe("funcColor", () => {
  it("itemColor in different agents", () => {
    const expr = compile("$itemColor(blue)H$itemColor() + O");
    expect(expr.getMessage()).toBe("");
    const items: ChemNodeItem[] = [];
    expr.walk({
      itemPre(obj) {
        items.push(obj);
      },
    });
    expect(items.length).toBe(2);
    expect(makeTextFormula(items[0]!)).toBe("H");
    expect(items[0]!.color).toBe("blue");
    expect(makeTextFormula(items[1]!)).toBe("O");
    expect(items[1]!.color).toBeUndefined();
  });

  it("AgentK color", () => {
    const expr = compile("$color(green)3H2");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    const n = agent.n!;
    expect(n).toBeDefined();
    expect(n.num).toBe(3);
    expect(n.text).toBe("");
    expect(n.color).toBe("green");
  });
});
