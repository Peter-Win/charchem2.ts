console.log("node-js > props");
const assert = require('node:assert').strict;
const {ChemSys} = require("../../../dist/ChemSys");
const {makeElemList} = require("../../../dist/inspectors/makeElemList");

// see https://en.wikipedia.org/wiki/Potassium_ferrocyanide
// and https://www.chemspider.com/Chemical-Structure.21169622.html
const expr = ChemSys.compile("K4[Fe(CN)6]*3H2O");
assert.equal(expr.getMessage(), "", `Compile error`);

const mass = ChemSys.calcMass(expr);
assert.equal(mass.toFixed(3), "422.390", "Invalid mass");

const brutto = ChemSys.makeBruttoKey(expr);
assert.equal(brutto, "C6H6FeK4N6O3")

assert.equal(expr.isLinear(), true);
assert.equal(ChemSys.isAbstract(expr), false);
assert.equal(ChemSys.calcCharge(expr), 0, "Invalid charge");

// Elements list
const list = makeElemList(expr);
list.sortByHill();
assert.equal(list.toString(), "C6H6FeK4N6O3", "Ivalid list of elements");
const h = list.findById("H");
assert.notEqual(h, undefined, "h must be defined");
assert.equal(h.n, 6, "invalid H count");