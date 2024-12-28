const fs = require("node:fs");
const path = require("node:path");

const staticFolder = path.resolve(__dirname, "..", "static");
const cssName = "charchem.css";
const langsName = "internationalDict.json";

/**
 * Copy static files into library folder
 * @param {string} libFolder 
 */
const copyStaticFiles = (libFolder) => {
  for (let shortName of [cssName, langsName]) {
    fs.copyFileSync(
      path.join(staticFolder, shortName), 
      path.join(libFolder, shortName)
    );
    console.log(`Copy ${shortName} from ${staticFolder} to ${libFolder}`);
  }
}
module.exports = {copyStaticFiles}