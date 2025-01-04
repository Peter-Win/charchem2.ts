/**
 * Build library
 */
const cp = require("node:child_process");
const path = require("node:path");

const cwd = path.resolve(__dirname, "..", "..");

process.stdout.write("html > yarn buildLib\n");
cp.exec("yarn buildLib", {cwd});