import { DraftGraph } from "../../DraftGraph";
import { compile } from "../../../compiler/compile";
import { draftGraphFromAutoNode } from "../draftGraphFromAutoNode";
import { makeElemList } from "../../../inspectors/makeElemList";
import { ChemAtom } from "../../../core/ChemAtom";
import { ChemNodeItem } from "../../../core/ChemNodeItem";

describe("draftGraphFromAutoNode", () => {
  it("linear with different multipicity", () => {
    //  0    1   2   3    4
    // CH3 - C ≡ C - CH = CH2
    const expr = compile("-|||-||");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    const { nodes } = agent;
    expect(nodes.length).toBe(5);
    // CH3
    expect(makeElemList(nodes[0]!).toString()).toBe("CH3");
    const ni0: ChemNodeItem = nodes[0]!.items[0]!;
    expect(ni0).toBeInstanceOf(ChemNodeItem);
    expect(ni0.obj).toBeInstanceOf(ChemAtom);
    expect(ni0.obj).toHaveProperty("id", "C");
    const g0: DraftGraph = draftGraphFromAutoNode(nodes[0]!);
    expect(g0.getElemList().toString()).toBe("CH3");
    expect(g0.verices.length).toBe(4);
    expect(g0.edges.length).toBe(3);
    expect(g0.verices[0]!.valency).toBe(4);
    expect(g0.verices[0]!.reserved).toBe(1);
    expect(g0.verices[1]!.valency).toBe(1);
    expect(g0.verices[1]!.reserved).toBe(0);
    // C
    const g1 = draftGraphFromAutoNode(nodes[1]!);
    expect(g1.getElemList().toString()).toBe("C");
    expect(g1.edges.length).toBe(0);
    expect(g1.verices.length).toBe(1);
    expect(g1.verices[0]!.valency).toBe(4);
    expect(g1.verices[0]!.reserved).toBe(4);
    // CH
    const g3 = draftGraphFromAutoNode(nodes[3]!);
    expect(g3.getElemList().toString()).toBe("CH");
    expect(g3.edges.length).toBe(1);
    expect(g3.verices.length).toBe(2);
    expect(g3.verices[0]!.valency).toBe(4);
    expect(g3.verices[0]!.reserved).toBe(3);
    expect(g3.verices[1]!.valency).toBe(1);
    expect(g3.verices[1]!.reserved).toBe(0);
    // CH2
    const g4 = draftGraphFromAutoNode(nodes[4]!);
    expect(g4.getElemList().toString()).toBe("CH2");
    expect(g4.edges.length).toBe(2);
    expect(g4.verices.length).toBe(3);
    expect(g4.verices[0]!.valency).toBe(4);
    expect(g4.verices[0]!.reserved).toBe(2);
    expect(g4.verices[1]!.valency).toBe(1);
    expect(g4.verices[1]!.reserved).toBe(0);
  });
  it("branches", () => {
    //  0 \ 1/ 3
    //     ||
    //      2
    const expr = compile("\\|`|/");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent).toBeDefined();
    const { nodes } = agent;
    expect(nodes.length).toBe(4);
    // CH3
    const g0 = draftGraphFromAutoNode(nodes[0]!);
    expect(g0.getElemList().toString()).toBe("CH3");
    expect(g0.verices[0]?.reserved).toBe(1);
    // C
    const g1 = draftGraphFromAutoNode(nodes[1]!);
    expect(g1.getElemList().toString()).toBe("C");
    expect(g1.verices[0]?.reserved).toBe(4);
    // CH2
    const g2 = draftGraphFromAutoNode(nodes[2]!);
    expect(g2.getElemList().toString()).toBe("CH2");
    expect(g2.verices[0]?.reserved).toBe(2);
  });
});
