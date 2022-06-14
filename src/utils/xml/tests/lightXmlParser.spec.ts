import { lightXmlParser } from "../lightXmlParser";
import { XmlAttrs } from "../xmlTypes";

interface TagDef {
  tag: string;
  attrs: XmlAttrs;
}

const tagHandler = (tagsList: TagDef[]) => (tag: string, attrs: XmlAttrs) => {
  tagsList.push({ tag, attrs });
};

describe("lightXmlParser", () => {
  it("single tag without attributes", () => {
    const tagsList: TagDef[] = [];
    lightXmlParser(`<font-face>`, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "font-face", attrs: {} }]);
  });
  it("single closed tag without attributes", () => {
    const tagsList: TagDef[] = [];
    lightXmlParser(`<font-face/>`, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "font-face", attrs: {} }]);
  });
  it("single closed tag with space without attributes", () => {
    const tagsList: TagDef[] = [];
    lightXmlParser(`<font-face />`, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "font-face", attrs: {} }]);
  });

  it("single tag with with attributes", () => {
    const tagsList: TagDef[] = [];
    const xml = `  <font-face 
    font-family="Roboto"
    font-weight="700"
    font-stretch="normal"
    units-per-em="2048"
   />`;
    lightXmlParser(xml, tagHandler(tagsList));
    expect(tagsList).toEqual([
      {
        tag: "font-face",
        attrs: {
          "font-family": "Roboto",
          "font-weight": "700",
          "font-stretch": "normal",
          "units-per-em": "2048",
        },
      },
    ]);
  });
  it("multiple tags with escaped attributes", () => {
    const tagsList: TagDef[] = [];
    const xml = `<def>
  <glyph name="Sigma" unicode="&#x3a3;" />
  <glyph name="uni0411" unicode="&#x411;" />
</def>`;
    lightXmlParser(xml, tagHandler(tagsList));
    expect(tagsList).toEqual([
      { tag: "def", attrs: {} },
      { tag: "glyph", attrs: { name: "Sigma", unicode: "Σ" } },
      { tag: "glyph", attrs: { name: "uni0411", unicode: "Б" } },
    ]);
  });
  it("spaces in attributes", () => {
    const tagsList: TagDef[] = [];
    lightXmlParser(`<a href = "url" />`, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "a", attrs: { href: "url" } }]);
  });
  it("non key-value attributes", () => {
    const src = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >`;
    const tagsList: TagDef[] = [];
    lightXmlParser(src, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "!DOCTYPE", attrs: {} }]);
  });
  it("non-string value", () => {
    const tagsList: TagDef[] = [];
    lightXmlParser(`<wrong b=B />`, tagHandler(tagsList));
    expect(tagsList).toEqual([]);
  });
  it("long attr", () => {
    const attr = `M364 840c150 0 256 -78 256 -78l-76 -150s-82 57 -167 57c-64 0 -98 -29 -98 -74c0 -46 78 -79 172 -119c92 -39 193 -117 193 -225c0 -197 -150 -266 -311 -266c-193 0 -310 109 -310 109l94 158s110 -93 202 -93c41 0 119 4 119 81c0 60 -88 87 -186 136
    c-99 49 -157 126 -157 212c0 154 136 252 269 252z`;
    const tagsList: TagDef[] = [];
    lightXmlParser(`<glyph d="${attr}" />`, tagHandler(tagsList));
    expect(tagsList).toEqual([{ tag: "glyph", attrs: { d: attr } }]);
  });
});
