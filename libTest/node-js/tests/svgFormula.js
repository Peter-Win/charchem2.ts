/**
 * Source foumula: http://charchem.org/ru/subst-ref/?id=313
 */
console.log("node-js > svgFormula");
const fs = require("node:fs");
const path = require("node:path");
const assert = require('node:assert').strict;
const {compile} = require("../../../dist/compiler/compile");
const {buildExpression} = require("../../../dist/structBuilder/buildExpression");
const {SvgSurfacePortable} = require("../../../dist/drawSys/svg/SvgSurfacePortable");
const {standaloneExportOptions} = require("../../../dist/drawSys/svg/standaloneExportOptions");
const {SvgFont} = require("../../../dist/drawSys/portableFonts/svgFont/SvgFont");
const {renderTopFrame} = require("../../../dist/drawSys/figures/renderTopFrame");
const {createPortableImgProps} = require("../../../dist/drawSys/portableFonts/createPortableImgProps");
const {createEps} = require("../../../dist/drawSys/ps/createEps");

const title = "Flavanonol";
const srcCode = "$color(blue)|$color()<$color(green)\\wOH$color()>`/$color(red)|O`|$color()`\\`|`\\\\`/||\\//`|0/O\\/d\\\\/`||`\\`//|; #-5\\0\"Flav\"$color(blue)\"an\"$color(red)\"on\"$color(green)\"ol\"$color();#O-0$color(green)\"3-hydroxy\"$color(blue)\"-2,3-dihydro\"_(y.7,N0)$color()\"-2-phenylchromen-\"$color(red)\"4-one\"";

// Make expression from source formula code
const expr = compile(srcCode);
assert.equal(expr.getMessage(), "");

// load font
const fontName = path.resolve(__dirname, "..", "..", "..", "static", "fonts", "Cambria-regular.svg");
const fontXmlCode = fs.readFileSync(fontName, {encoding: "utf-8"});
const mainFont = SvgFont.create(fontXmlCode);

const imgProps = createPortableImgProps({
  mainFont,
  fontSize: 18,
  fillColor: "black",
});

// Build formula image in abstract format
const {frame} = buildExpression(expr, imgProps);

// Convert abstract figures to portable SVG format
const surface = new SvgSurfacePortable(mainFont);
renderTopFrame(frame, surface);
const dstText = surface.exportText(standaloneExportOptions);

const dirResult = path.resolve(__dirname, "..", "..", "result");
if (!fs.existsSync(path)) {
  fs.mkdirSync(dirResult);
}

// Write SVG text to file
const dstFileName = path.resolve(dirResult, "formula.svg");
fs.writeFileSync(dstFileName, dstText, {encoding: "utf-8"});

// Make EPS-file
const epsName = path.resolve(dirResult, "formula.eps");
const epsContent = createEps({ frame, title}).exportText();
fs.writeFileSync(epsName, epsContent, {encoding: "ascii"});
