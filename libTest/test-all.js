const path = require("node:path");
const cp = require("node:child_process");

console.log("> yarn build");
cp.execSync("yarn build", {cwd: path.resolve(__dirname, "..")});

console.log("> html");
cp.execSync("node ./html/test-html.js", {stdio: "inherit"});

console.log("> node-js");
cp.execSync("node ./node-js/test-node-js.js", {stdio: "inherit"});