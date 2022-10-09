import fs = require("fs");
import path = require("path");
import { drawPeriodicTable } from "../drawPeriodicTable";
import { tableRulesStd } from "../TableRulesStd";

const writeTable = (shortName: string, text: string) => {
  const fullName = path.join(__dirname, `${shortName}.html`);
  const html = `<!doctype html>
<html>
<head>
  <link href="../../../examples/charchem.css" rel="stylesheet" />
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
  });
});
