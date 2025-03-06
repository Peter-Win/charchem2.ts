import { compile } from "../../../compiler/compile";
import { ChemBracketEnd } from "../../../core/ChemBracket";
import { ChemComment } from "../../../core/ChemComment";
import { buildTextNodes } from "../buildTextNodes";
import { TextNode } from "../TextNode";

describe("buildTextNodes", () => {
  it("agent op agent", () => {
    const expr = compile("3H2$itemColor1(cyan)O + Ca");
    expect(expr.getMessage()).toBe("");
    const res = buildTextNodes(expr);
    expect(res.type).toBe("group"); // expression group
    expect(res.items?.length).toBe(5); // 0: agent0=H2O, 1:space, 2:op=+, 3:space, 4:agent1=Ca
    const agent0 = res.items?.[0];
    expect(agent0?.type).toBe("group");
    expect(agent0?.items?.length).toBe(2); // k, node0
    expect(agent0?.items?.[0]?.type).toBe("k");
    expect(agent0?.items?.[0]).toHaveProperty("k.num", 3);
    expect(agent0?.items?.[1]?.type).toBe("group"); // node group
    const node0 = agent0?.items?.[1];
    expect(node0?.items?.length).toBe(2); // two items in node
    const it0 = node0?.items?.[0];
    expect(it0?.type).toBe("item");
    expect(it0?.items?.length).toBe(2);
    expect(it0?.items?.[0]?.type).toBe("atom");
    expect(it0?.items?.[0]).toHaveProperty("atom.id", "H");
    expect(it0?.items?.[1]?.type).toBe("k");
    expect(it0?.items?.[1]?.pos).toBe("RB");
    expect(it0?.items?.[1]).toHaveProperty("k.num", 2);
    const it1 = node0?.items?.[1];
    expect(it1?.items?.length).toBe(1);
    expect(it1?.items?.[0]?.type).toBe("atom");
    expect(it1?.items?.[0]).toHaveProperty("atom.id", "O");
    expect(it1?.items?.[0]?.color).toBe("cyan");

    expect(res?.items?.[1]?.type).toBe("space");
    expect(res?.items?.[1]).toHaveProperty("spaceType", "agentOp");

    expect(res?.items?.[2]?.type).toBe("op");
    expect(res?.items?.[2]?.color).toBe(undefined);
    expect(res?.items?.[2]).toHaveProperty("op.srcText", "+");

    expect(res?.items?.[3]?.type).toBe("space");
    expect(res?.items?.[3]).toHaveProperty("spaceType", "agentOp");

    const agent1 = res?.items?.[4];
    expect(agent1?.type).toBe("group"); // agent
    expect(agent1?.items?.length).toBe(1); // 1 node
    expect(agent1?.items?.[0]?.type).toBe("group");
    expect(agent1?.items?.[0]?.items?.length).toBe(1);
    const it10 = agent1?.items?.[0]?.items?.[0];
    expect(it10?.type).toBe("item");
    expect(it10?.items?.length).toBe(1);
    expect(it10?.items?.[0]?.type).toBe("atom");
    expect(it10?.items?.[0]?.color).toBe(undefined);
    expect(it10?.items?.[0]).toHaveProperty("atom.id", "Ca");
  });

  it("op with comment", () => {
    const expr = compile(`Fe "[Delta]"->`);
    expect(expr.getMessage()).toBe("");
    const res = buildTextNodes(expr);
    expect(res.type).toBe("group"); // expression group
    expect(res.items?.length).toBe(3); // 0: agent0=Fe, 1:space, 2:op=->
    expect(res.items?.[0]?.type).toBe("group");
    expect(res.items?.[1]?.type).toBe("space");
    const ent2 = res.items?.[2]!;
    expect(ent2?.type).toBe("column");
    expect(ent2).toHaveProperty("columnType", "op");
    expect(ent2.items?.length).toBe(2);
    expect(ent2.items?.[0]?.type).toBe("op");
    expect(ent2.items?.[0]).toHaveProperty("op.dstText", "→");
    expect(ent2.items?.[0]?.pos).toBe(undefined);
    expect(ent2.items?.[1]?.type).toBe("richText");
    expect(ent2.items?.[1]?.pos).toBe("T");
    expect(ent2.items?.[1]?.items?.length).toBe(1);
    const txn = ent2.items?.[1]?.items?.[0]!;
    expect(txn?.type).toBe("text");
    expect(txn).toHaveProperty("text", "Δ");
  });
  it("brackets", () => {
    //  ┌     ┐2-
    //  │ SO  │
    //  └   4 ┘3
    const expr = compile("[SO4]3^2-");
    expect(expr.getMessage()).toBe("");
    const res = buildTextNodes(expr);
    expect(res.type).toBe("group"); // expression group
    expect(res.items?.length).toBe(1);
    const agent = res.items?.[0]!;
    expect(agent.type).toBe("group"); // agent group
    expect(agent.items?.length).toBe(1);
    const node = agent.items?.[0]!; // node
    expect(node?.type).toBe("brackets");
    expect(node.items?.length).toBe(3); // group, coefficient, charge
    const [content, coeff, charge] = node.items!;

    expect(coeff?.type).toBe("k");
    expect(coeff?.pos).toBe("RB");
    expect(coeff).toHaveProperty("k.num", 3);

    expect(charge?.type).toBe("charge");
    expect(charge?.pos).toBe("RT");
    expect(charge).toHaveProperty("charge.text", "2-");

    expect(content?.type).toBe("group"); // group for brackets content
    expect(content?.items?.length).toBe(3); // [, node, ]
    expect(content?.items?.[0]?.type).toBe("bracket");
    expect(content?.items?.[0]).toHaveProperty("text", "[");
    expect(content?.items?.[1]?.type).toBe("group"); // node group
    expect(content?.items?.[1]?.items?.length).toBe(2); // 2 items: S and O4
    expect(content?.items?.[2]?.type).toBe("bracket");
    expect(content?.items?.[2]).toHaveProperty("text", "]");
    // brackets
    // +--group
    // |  +--[
    // |  +--group
    // |  |  +--S
    // |  |  +--O4
    // |  +--]
    // +--k
    // +--charge
  });

  it("bracket end", () => {
    const expr = compile("[CN]6");
    expect(expr.getMessage()).toBe("");
    let be: ChemBracketEnd | undefined;
    expr.walk({
      bracketEnd(obj) {
        be = obj;
      },
    });
    expect(be).toBeDefined();
    const n = buildTextNodes(be!);
    expect(n.type).toBe("group");
    expect(n.items?.length).toBe(2);
    expect(n.items?.[0]?.type).toBe("bracket");
    expect(n.items?.[1]?.type).toBe("k");
  });

  it("rich text", () => {
    const expr = compile(`-"H_2SO_4"`);
    expect(expr.getMessage()).toBe("");
    let comment: ChemComment | undefined;
    expr.walk({
      comment(obj) {
        comment = obj;
      },
    });
    expect(comment).toBeDefined();
    const res = buildTextNodes(comment!);
    const color = undefined;
    expect(res).toEqual({
      type: "group",
      groupType: "expr",
      color,
      items: [
        {
          type: "comment",
          comment: comment!,
          color,
          items: [
            {
              type: "richText", // Total comment
              color,
              items: [
                {
                  type: "richText", // H_2
                  color,
                  items: [
                    { type: "text", text: "H", color },
                    {
                      type: "richText",
                      color,
                      pos: "RB",
                      items: [{ type: "text", text: "2", color }],
                    },
                  ],
                },
                {
                  type: "richText", // SO_4
                  color,
                  items: [
                    { type: "text", text: "SO", color },
                    {
                      type: "richText",
                      color,
                      pos: "RB",
                      items: [{ type: "text", color, text: "4" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } satisfies TextNode);
  });
});
