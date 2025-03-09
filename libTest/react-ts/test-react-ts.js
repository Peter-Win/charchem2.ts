const path = require("node:path");
const cp = require("node:child_process");
const fs = require("node:fs");

const commands = [
  ["npm i --force", () => !fs.existsSync(path.join(__dirname, "node_modules"))],
  ["npm run build", () => true],
];
commands.forEach(([cmd, cond]) => {
  if (cond()) {
    console.log(`react-ts > ${cmd}`);
    cp.execSync(cmd, {stdio: "inherit", cwd: __dirname});
  }
})

// Change script url
const indexName = path.resolve(__dirname, "dist", "index.html");
const srcText = fs.readFileSync(indexName, {encoding: "utf-8"});
const dstText = srcText.replace('src="/bundle.js"', 'src="./bundle.js"');
fs.writeFileSync(indexName, dstText, {encoding: "utf-8"});
