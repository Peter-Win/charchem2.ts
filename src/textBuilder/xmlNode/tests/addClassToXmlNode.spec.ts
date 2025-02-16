import { addClassToXmlNode } from "../addClassToXmlNode";
import { XmlNode } from "../XmlNode";

describe("addClassToXmlNode", () => {
  it("single name", () => {
    const node: XmlNode = { tag: "a" };
    addClassToXmlNode(node, "first");
    expect(node).toHaveProperty("attrs.class", "first");
    addClassToXmlNode(node, "second");
    expect(node).toHaveProperty("attrs.class", "first second");
    addClassToXmlNode(node, "first"); // ignore existing
    expect(node).toHaveProperty("attrs.class", "first second");
  });
  it("classes with space", () => {
    const node: XmlNode = { tag: "x" };
    addClassToXmlNode(node, "a b");
    expect(node).toHaveProperty("attrs.class", "a b");
    addClassToXmlNode(node, "b c d");
    expect(node).toHaveProperty("attrs.class", "a b c d");
  });
  it("classes list", () => {
    const node: XmlNode = { tag: "x" };
    addClassToXmlNode(node, ["c1", "c2"]);
    expect(node).toHaveProperty("attrs.class", "c1 c2");
    addClassToXmlNode(node, ["c3", "c4", "c1"]);
    expect(node).toHaveProperty("attrs.class", "c1 c2 c3 c4");
  });
});
