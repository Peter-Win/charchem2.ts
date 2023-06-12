import { Point } from "../../math/Point";
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
  it("MergeChainsWithRef", () => {
    //   0        3  H         H
    //    \      /    0       2
    //     1 == 2      C =1= C
    //    /      \    3       4
    //   4        5  H         H
    const expr = compile("$slope(60)H\\C-C/H; H/#2-#3\\H");
    expect(expr.getMessage()).toBe("");
    const { bonds, nodes } = expr.getAgents()[0]!;

    expect(bonds.length).toBe(5);
    expect(bonds[0]?.debugText()).toBe("0(60)1");
    expect(bonds[1]?.debugText()).toBe("1(~0*2)2");
    expect(bonds[2]?.debugText()).toBe("2(-60)3");
    expect(bonds[3]?.debugText()).toBe("4(-60)1");
    expect(bonds[4]?.debugText()).toBe("2(60)5");
    const subChain1 = nodes[0]?.subChain;
    expect(nodes[0]?.pt.toString()).toBe("(0, 0)");
    expect(nodes[1]?.subChain).toBe(subChain1);
    expect(nodes[1]?.pt.toString()).toBe(
      new Point(0.5, Math.sqrt(3) / 2).toString()
    );
    // subchain #2
    const subChain2 = nodes[2]?.subChain;
    expect(subChain2).not.toBe(subChain1);
    expect(nodes[2]?.pt.toString()).toBe("(0, 0)");
    expect(nodes[3]?.subChain).toBe(subChain2);
    expect(nodes[3]?.pt.toString()).toBe(
      new Point(0.5, -Math.sqrt(3) / 2).toString()
    );
    // #1
    expect(nodes[4]?.subChain).toBe(subChain1);
    expect(nodes[4]?.pt.toString()).toBe(new Point(0, Math.sqrt(3)).toString());
    // #2
    expect(nodes[5]?.subChain).toBe(subChain2);
    expect(nodes[5]?.pt.toString()).toBe(
      new Point(0.5, Math.sqrt(3) / 2).toString()
    );
  });

  it("MergeChainsWithSoftBonds", () => {
    //   0        3  H         H
    //    \      /    0       2
    //     1 == 2      C =1= C
    //    /      \    3       4
    //   4        5  H         H
    // Отличие от предыдущего случая в том что нету ссылки на узел #3
    // То есть должны правильно смержиться две мягких связи.
    const expr = compile("$slope(60)H\\C-C/H; H/#2-\\H");
    expect(expr.getMessage()).toBe("");
    const { bonds, nodes } = expr.getAgents()[0]!;
    expect(bonds.length).toBe(5);
    expect(bonds[0]?.debugText()).toBe("0(60)1");
    expect(bonds[1]?.debugText()).toBe("1(~0*2)2");
    expect(bonds[2]?.debugText()).toBe("2(-60)3");
    expect(bonds[3]?.debugText()).toBe("4(-60)1");
    expect(bonds[4]?.debugText()).toBe("2(60)5");
    const subChain1 = nodes[0]?.subChain;
    expect(nodes[0]?.pt.toString()).toBe("(0, 0)");
    expect(nodes[1]?.subChain).toBe(subChain1);
    expect(nodes[1]?.pt.toString()).toBe(
      new Point(0.5, Math.sqrt(3) / 2).toString()
    );
    // subchain #2
    const subChain2 = nodes[2]?.subChain;
    expect(subChain2).not.toBe(subChain1);
    expect(nodes[2]?.pt.toString()).toBe("(0, 0)");
    expect(nodes[3]?.subChain).toBe(subChain2);
    expect(nodes[3]?.pt.toString()).toBe(
      new Point(0.5, -Math.sqrt(3) / 2).toString()
    );
    // #1
    expect(nodes[4]?.subChain).toBe(subChain1);
    expect(nodes[4]?.pt.toString()).toBe(new Point(0, Math.sqrt(3)).toString());
    // #2
    expect(nodes[5]?.subChain).toBe(subChain2);
    expect(nodes[5]?.pt.toString()).toBe(
      new Point(0.5, Math.sqrt(3) / 2).toString()
    );
  });

  it("CheckPrevBondAfterMerge", () => {
    // После слияния связей должна правильно работать следующая относительная связь
    // В данном примере первая часть связи имеет наклон 60 (_(A60)), а вторая вообще без свойств (_#3).
    // Но после слияния результат должен сохранять уклон 60.
    // И относительная связь _p6 должна образовать в итоге угол 120
    //     Nodes     Bonds
    //  0---1---3  *-0-*-3-*
    //       \\/        1 2
    //        2          *
    //       /          4
    //      4
    const expr = compile("-_(A60)_q3_q3_#3_p6");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { nodes } = agent;
    expect(String(nodes[0]?.pt)).toBe("(0, 0)");
    expect(String(nodes[1]?.pt)).toBe("(1, 0)");
    const pt2 = new Point(1.5, Math.sqrt(3) / 2);
    expect(String(nodes[2]?.pt)).toBe(String(pt2));
    expect(String(nodes[3]?.pt)).toBe("(2, 0)");
    const pt4 = new Point(1, Math.sqrt(3));
    expect(String(nodes[4]?.pt)).toBe(String(pt4));
  });

  it("MergeByDirection", () => {
    // 0---1---4
    //     ║   |
    //     2---3
    const expr = compile("-|-`|`-\\#3");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const { nodes, bonds } = agent;
    expect(nodes.length).toBe(5);
    expect(bonds.length).toBe(5);
    expect(bonds[1]?.n).toBe(2);
  });
});
