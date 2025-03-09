import { createTestCompiler } from "../../ChemCompiler";
import { ChemNode } from "../../../core/ChemNode";
import { textFormula } from "../../../textBuilder/textFormula";
import { parseNodesListDef } from "../bondSpline";
import { createTestCompilerWithSingleAgent } from "../../createTestCompilerWithSingleAgent";

const textNodes = (nodes: (ChemNode | undefined)[]): string[] =>
  nodes.map((n) => (n ? textFormula(n, "text") : "NULL"));

describe("TestParseNodesListDef", () => {
  it("Empty List", () => {
    const compiler = createTestCompiler("");
    const res = parseNodesListDef(compiler, "", 0);
    expect(res).toBeUndefined();
  });
  it("Single Chunks", () => {
    const compiler = createTestCompilerWithSingleAgent("{A}--{B}:b|{C}--{D}");
    const nodes = parseNodesListDef(compiler, "1;b;-1", 0);
    expect(nodes).toBeDefined();
    expect(textNodes(nodes!)).toEqual(["A", "B", "D"]);
  });
  it("Single Interval", () => {
    const compiler = createTestCompilerWithSingleAgent("{A}--{B}:b|{C}--{D}");
    const nodes = parseNodesListDef(compiler, "b:-1", 1);
    expect(nodes).toBeDefined();
    expect(textNodes(nodes!)).toEqual(["B", "C", "D"]);
  });
  it("Intervals", () => {
    //       A---B
    //      /     \
    //     H       C
    //     |       |
    //     G       D
    //      \     /
    //       F---E
    const compiler = createTestCompilerWithSingleAgent(
      "$slope(45){A}--{B}\\{C}|{D}`/{E}`--{F}`\\{G}`|{H}/"
    );
    const nodes = parseNodesListDef(compiler, "1:3;5:7", 1);
    expect(nodes).toBeDefined();
    expect(textNodes(nodes!)).toEqual(["A", "B", "C", "E", "F", "G"]);
  });
});
