import { escapeXml, hexLow, dec } from "../escapeXml";

describe("escapeXml", () => {
  it("special characters only", () => {
    expect(escapeXml("")).toBe("");
    expect(escapeXml("Abc")).toBe("Abc");
    expect(escapeXml("\t\n")).toBe("\t\n");
    expect(escapeXml("<\"'&>")).toBe("&lt;&quot;&apos;&amp;&gt;");
    expect(escapeXml("Цыплёнок")).toBe("Цыплёнок");
  });
  it("hex non-ascii", () => {
    expect(escapeXml("", hexLow)).toBe("");
    expect(escapeXml("Abc", hexLow)).toBe("Abc");
    expect(escapeXml("\t\n\r", hexLow)).toBe("&#x9;&#xa;&#xd;");
    expect(escapeXml("<\"'&>", hexLow)).toBe("&lt;&quot;&apos;&amp;&gt;");
    expect(escapeXml("Цыплёнок", hexLow)).toBe(
      "&#x426;&#x44b;&#x43f;&#x43b;&#x451;&#x43d;&#x43e;&#x43a;"
    );
  });
  it("decimal non-ascii", () => {
    expect(escapeXml("", dec)).toBe("");
    expect(escapeXml("Abc", dec)).toBe("Abc");
    expect(escapeXml("\t\n\r", dec)).toBe("&#9;&#10;&#13;");
    expect(escapeXml("<\"'&>", dec)).toBe("&lt;&quot;&apos;&amp;&gt;");
    expect(escapeXml("Цыплёнок", dec)).toBe(
      "&#1062;&#1099;&#1087;&#1083;&#1105;&#1085;&#1086;&#1082;"
    );
  });
});
