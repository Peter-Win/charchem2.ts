const path = require("node:path");
const cp = require("node:child_process");

const testsPath = path.resolve(__dirname, "tests")

const tests = [
  "props",
  "mass",
  "svgFormula",
];

tests.forEach(name => cp.execSync(`node ${path.join(testsPath, `${name}.js`)}`, {stdio: "inherit"}));

