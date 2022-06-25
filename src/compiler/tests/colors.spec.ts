import { compile } from "../compile";
import { makeTextFormula } from "../../inspectors/makeTextFormula";
import { rulesHtml } from "../../textRules/rulesHtml";

describe("colors", () => {
  it("Color", () => {
    const expr = compile("$color(red)H2$color(blue)S$color()O4");
    expect(expr.getMessage()).toBe("");
    const { items } = expr.getAgents()[0]!.nodes[0]!;
    expect(items).toHaveLength(3);
    expect(items[0]!.color).toBe("red");
    expect(items[1]!.color).toBe("blue");
    expect(items[2]!.color).toBeUndefined();
    expect(makeTextFormula(expr, rulesHtml)).toBe(
      `<span style="color:red">H<sub>2</sub></span><span style="color:blue">S</span>O<sub>4</sub>`
    );
  });
});
