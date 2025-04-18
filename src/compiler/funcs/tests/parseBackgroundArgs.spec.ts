import { createTestCompilerWithSingleAgent } from "../../createTestCompilerWithSingleAgent";
import { createTestCompiler } from "../../ChemCompiler";
import { parseBackgroundArgs } from "../funcBackground";
import { textFormula } from "../../../textBuilder/textFormula";
import { compile } from "../../compile";
import { ChemBackground } from "../../../core/ChemBackground";

describe("parseBackgroundArgs", () => {
  it("params without keys", () => {
    const compiler = createTestCompiler("");
    const params = parseBackgroundArgs(
      compiler,
      ["*", "round", "red"],
      [1, 3, 9]
    );
    expect(params).toEqual({ isAll: true, shape: "round", fill: "red" });
  });
  it("params with keys", () => {
    const compiler = createTestCompiler("");
    const params = parseBackgroundArgs(
      compiler,
      ["padding:0.1;0.4", "stroke:rgba(255,0,0,0.2)", "width:4"],
      [1, 3, 9]
    );
    expect(params).toEqual({
      padding: [0.1, 0.4],
      stroke: "rgba(255,0,0,0.2)",
      strokeWidth: 4,
    });
  });
  it("nodes list", () => {
    const compiler = createTestCompilerWithSingleAgent("F-C<||S>-O");
    const params = parseBackgroundArgs(compiler, ["to:1;-1"], [1]);
    expect(params.nodes).toBeDefined();
    expect(params.nodes!.length).toBe(2);
    expect(textFormula(params.nodes![0]!, "text")).toBe("F");
    expect(textFormula(params.nodes![1]!, "text")).toBe("O");
  });
});

describe("funcBackground", () => {
  it("short", () => {
    const expr = compile("$bg(brown)NH2|COOH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.commands[1]).toBeInstanceOf(ChemBackground);
    const cmd = agent.commands[1] as ChemBackground;
    expect(cmd.params.fill).toBe("brown");
    expect(cmd.params.nodes).toBeDefined();
    expect(cmd.params.nodes!.length).toBe(1);
    expect(textFormula(cmd.params.nodes![0]!, "text")).toBe("NH2");
  });
});
