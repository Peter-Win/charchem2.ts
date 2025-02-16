import { compile } from "../../../../compiler/compile";
import { ChemNodeItem } from "../../../../core/ChemNodeItem";
import { FnNodeToXml } from "../../../xmlNode/FnNodeToXml";
import { onNodeItem } from "../onNodeItem";
import { buildTextNodes } from "../../../buildTextNodes/buildTextNodes";
import { renderXmlNode } from "../../../xmlNode/renderXmlNode";

const create: FnNodeToXml = (txNode) => {
  switch (txNode.type) {
    case "item":
      return onNodeItem(txNode, create);
    case "atom":
      return { tag: "mi", content: txNode.atom.id };
    case "k":
      return { tag: "mn", content: `${txNode.k}`, pos: "RB" };
    case "charge":
      return { tag: "mi", content: txNode.charge.text };
    default:
      break;
  }
  throw Error(`Unsupported type: ${txNode.type}`);
};

const cc2ItemsMathML = (code: string): string => {
  const expr = compile(code);
  if (!expr.isOk()) return expr.getMessage();
  const items: ChemNodeItem[] = [];
  expr.walk({
    itemPre(obj) {
      items.push(obj);
    },
  });
  const tnodes = items.map((item) => buildTextNodes(item).items?.[0]);
  const xnodes = tnodes.map((node) =>
    node ? onNodeItem(node, create) : undefined
  );
  const mml = xnodes.map((xn) => (xn ? renderXmlNode(xn) : "<undefined />"));
  return mml.join(";");
};

test("onNodeItem", () => {
  expect(cc2ItemsMathML("Al")).toBe("<mi>Al</mi>");
  expect(cc2ItemsMathML("Al2")).toBe("<msub><mi>Al</mi><mn>2</mn></msub>");
  expect(cc2ItemsMathML("Fe(iii)")).toBe(
    "<mover><mi>Fe</mi><mi>III</mi></mover>"
  );
  expect(cc2ItemsMathML("$nM(238)U")).toBe(
    "<mmultiscripts><mi>U</mi><mrow /><mrow /><mprescripts /><mn>92</mn><mn>238</mn></mmultiscripts>"
  );
});
