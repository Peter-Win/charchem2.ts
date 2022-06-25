import { compile } from "../compile";

describe("Bond Merge", () => {
  it("Ketone", () => {
    //    0
    //    |1
    //   /\\
    //  3  O 2
    const expr = compile("|\\O`\\`/");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(
      agent.bonds.map(
        (it) =>
          `${it.nodes[0]?.index}(${Math.round(
            it.dir!.polarAngleDeg()
          )}*${Math.round(it.n)})${it.nodes[1]?.index}`
      )
    ).toEqual(["0(90*1)1", "1(30*2)2", "1(150*1)3"]);
  });
  it("MergeWithRef", () => {
    //   0---1   bond0 0-1, bond1 1|2, bond2 2`-3 - обычные случаи
    //   | / |   bond3 3`|0 - стыковка с существующим узлом, найденным по вектору связи.
    //   3---2   0-1 - наложение на существующую связь. второй узел найден по вектору.
    //           bond4 1|3 - похоже на наложение, но второй узел указан через ссылку
    //
    const expr = compile("-|`-`|-|#4");
    expect(expr.getMessage()).toBe("");
    const { bonds } = expr.getAgents()[0]!;
    expect(bonds[0]!.nodes[0]?.pt.toString()).toBe("(0, 0)");
    expect(bonds[0]!.nodes[1]?.pt.toString()).toBe("(1, 0)");
    expect(bonds[0]!.n).toBe(2.0);

    expect(bonds[3]!.nodes[1]?.index).toBe(0);

    expect(bonds[4]!.nodes[0]?.index).toBe(1);
    expect(bonds[4]!.nodes[1]?.index).toBe(3);
    expect(bonds[4]!.dir?.toString()).toBe("(-1, 1)");
  });
});
