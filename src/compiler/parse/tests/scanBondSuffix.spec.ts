import { createTestCompiler } from "../../ChemCompiler";
import { ChemBond } from "../../../core/ChemBond";
import { scanBondSuffix } from "../scanBondSuffix";

describe("scanBondSuffix", () => {
  it("several suffixes", () => {
    const compiler = createTestCompiler("|hvH");
    compiler.pos = 1;
    const bond = new ChemBond();
    scanBondSuffix(compiler, bond);
    expect(compiler.pos).toBe(3);
    expect(bond.arr1).toBe(true);
    expect(bond.style).toBe(":");
  });
});
