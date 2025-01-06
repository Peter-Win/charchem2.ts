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
const {ChemImgProps} = require("../../../dist/drawSys/ChemImgProps");
const {LocalSvgFont} = require("../../../dist/drawSys/svg/LocalSvgFont");
const {SvgFont} = require("../../../dist/drawSys/portableFonts/svgFont/SvgFont");
const {renderTopFrame} = require("../../../dist/drawSys/figures/renderTopFrame");

const srcCode = "$color(blue)|$color()<$color(green)\\wOH$color()>`/$color(red)|O`|$color()`\\`|`\\\\`/||\\//`|0/O\\/d\\\\/`||`\\`//|; #-5\\0\"Flav\"$color(blue)\"an\"$color(red)\"on\"$color(green)\"ol\"$color();#O-0$color(green)\"3-hydroxy\"$color(blue)\"-2,3-dihydro\"_(y.7,N0)$color()\"-2-phenylchromen-\"$color(red)\"4-one\"";

// Make expression from source formula code
const expr = compile(srcCode);
assert.equal(expr.getMessage(), "");

// load font
const fontName = path.resolve(__dirname, "..", "..", "..", "static", "fonts", "Cambria-regular.svg");
const fontXmlCode = fs.readFileSync(fontName, {encoding: "utf-8"});
const fontFactory = SvgFont.create(fontXmlCode);

// Prepare image properties
const localFont = new LocalSvgFont(fontFactory, {
  family: fontFactory.fontFace.fontFamily,
  height: 18,
});
const style = { fill: "black"};
const imgProps = new ChemImgProps({font: localFont, style});
imgProps.init();

// Build formula image in abstract format
const {frame} = buildExpression(expr, imgProps);

// Convert abstract figures to portable SVG format
const surface = new SvgSurfacePortable(fontFactory);
renderTopFrame(frame, surface);
const dstText = surface.exportText(standaloneExportOptions);

// Write SVG text to file
const dstFileName = path.resolve(__dirname, "..", "..", "result", "formula.svg")
fs.writeFileSync(dstFileName, dstText, {encoding: "utf-8"});
