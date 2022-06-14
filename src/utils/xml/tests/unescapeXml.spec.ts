import { unescapeXml } from "../unescapeXml";

it("unescapeXml", () => {
  expect(unescapeXml("")).toBe("");
  expect(unescapeXml("simple")).toBe("simple");
  expect(unescapeXml("A&#xc0;&#xc1;&#xc2;&#xc3; a&#xe3;")).toBe("AÀÁÂÃ aã");
  expect(unescapeXml("&#931;")).toBe("Σ");
  expect(unescapeXml("&apos;&quot;&amp;&lt;&gt;")).toBe(`'"&<>`);
  expect(unescapeXml("&lt;div&gt;")).toBe("<div>");
});
