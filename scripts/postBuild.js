/**
 * Add static files after "build"
 */
const path = require("node:path");
const {copyStaticFiles} = require("./copyStaticFiles");

copyStaticFiles(path.resolve(__dirname, "..", "dist"));

