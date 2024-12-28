/**
 * This is plugin for buildLib
 * It is required to copy additional static files.
 */
const path = require("node:path");
const {copyStaticFiles} = require("./copyStaticFiles");
const pluginName = 'CharChemLibExt';

const libFolder = path.resolve(__dirname, "..", "lib");

class CharChemLibExt {
  apply(compiler) {
    compiler.hooks.done.tap(pluginName, () => {
      try {
        copyStaticFiles(libFolder);
      } catch (e) {
        console.error(e);
      }
    })
  }
}

module.exports = {CharChemLibExt};