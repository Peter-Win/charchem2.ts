import fs from "fs";
import path from "path";
import { drawPeriodicTable } from "../drawPeriodicTable";
import { tableRulesStd } from "../TableRulesStd";
import { lightXmlParser } from "../../utils/xml/lightXmlParser";
import { PeriodicTable } from "../../core/PeriodicTable";

const writeTable = (shortName: string, text: string) => {
  const fullName = path.join(__dirname, `${shortName}.html`);
  const html = `<!doctype html>
<html>
<head>
  <link href="../../../src/charchem.css" rel="stylesheet" />
</head>
<body>
${text}
</body>
</html>`;
  fs.writeFileSync(fullName, html, { encoding: "utf-8" });
};

describe("drawPeriodicTable", () => {
  it("std", () => {
    const text = drawPeriodicTable(tableRulesStd);
    writeTable("std", text);

    let elementsCount = 0;
    lightXmlParser(text, (tag, attrs) => {
      if (tag === "td" && attrs?.class?.startsWith("chem-element")) {
        elementsCount++;
      }
    });
    expect(elementsCount).toBe(PeriodicTable.elements.length);
  });
});
