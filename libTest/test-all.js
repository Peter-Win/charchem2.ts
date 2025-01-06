const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

const reportName = path.resolve(__dirname, "result", "!report.html");

// fs.unlinkSync(reportName);

console.log("> html");
cp.execSync("node ./html/test-html.js", {stdio: "inherit"});

console.log("> yarn build");
cp.execSync("yarn build", {cwd: path.resolve(__dirname, "..")});

console.log("> node-js");
cp.execSync("node ./node-js/test-node-js.js", {stdio: "inherit"});

console.log("> react-ts");
cp.execSync("node ./react-ts/test-react-ts.js", {stdio: "inherit"});

console.log("Generate report in", reportName);
const reportText = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test report</title>
  </head>
  <body>
    <h1>All tests were completed successfully</h1>
    <ul>
      <li><a href="../html/index.html">HTML result</a></li>
      <li>
        <div>Node.js result</div>
        <img src="./formula.svg" width="300px" />
      </li>
      <li><a href="../react-ts/dist/index.html">React result</a></li>
    </ul>
  </body>
</html>`;
fs.writeFileSync(reportName, reportText, {encoding: "utf-8"});
cp.execSync(reportName)