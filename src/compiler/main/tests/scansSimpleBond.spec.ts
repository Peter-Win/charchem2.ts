import { createTestCompiler } from "../../ChemCompiler";
import { scanSimpleBond } from "../bondSimple";
import { pointFromDeg } from "../../../math/Point";

describe("scansSimpleBond", () => {
  it("Not found", () => {
    const compiler = createTestCompiler("H2O");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeUndefined();
    expect(compiler.pos).toBe(0);
  });
  it("soft1", () => {
    const compiler = createTestCompiler("Me-OH");
    compiler.pos = 2;
    const bond = scanSimpleBond(compiler);
    expect(bond).not.toBeUndefined();
    expect(compiler.pos).toBe(3);
    expect(bond?.soft).toBe(true);
    expect(bond?.tx).toBe("-");
    expect(bond?.n).toBe(1.0);
    expect(bond?.dir?.toString()).toBe("(1, 0)");
  });
  it("soft1 alternate", () => {
    const compiler = createTestCompiler("\u2013Me");
    const bond = scanSimpleBond(compiler);
    expect(bond).not.toBeUndefined();
    expect(compiler.pos).toBe(1);
    expect(bond?.soft).toBe(true);
    expect(bond?.tx).toBe("-");
    expect(bond?.n).toBe(1.0);
  });
  it("soft2", () => {
    const compiler = createTestCompiler("=");
    const bond = scanSimpleBond(compiler);
    expect(bond).not.toBeUndefined();
    expect(compiler.pos).toBe(1);
    expect(bond?.soft).toBe(true);
    expect(bond?.n).toBe(2.0);
    expect(bond?.tx).toBe("=");
  });
  it("soft3", () => {
    const compiler = createTestCompiler("%");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(1);
    expect(bond?.n).toBe(3.0);
    expect(bond?.soft).toBe(true);
    expect(bond?.tx).toBe("≡");
  });
  it("Hard horiz 1", () => {
    const compiler = createTestCompiler("---");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(2);
    expect(bond?.soft).toBe(false);
    expect(bond?.tx).toBe("-");
    expect(bond?.n).toBe(1.0);
    expect(bond?.dir?.toString()).toBe("(1, 0)");
  });
  it("Hard horiz 3", () => {
    const compiler = createTestCompiler("%%%");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(2);
    expect(bond?.soft).toBe(false);
    expect(bond?.tx).toBe("≡");
    expect(bond?.n).toBe(3.0);
  });
  it("Vert 1", () => {
    const compiler = createTestCompiler("|-`|`-");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(1);
    expect(bond?.tx).toBe("|");
    expect(bond?.n).toBe(1.0);
    expect(bond?.dir?.toString()).toBe("(0, 1)");
  });
  it("Vert 2", () => {
    const compiler = createTestCompiler("||-`|`-");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(2);
    expect(bond?.tx).toBe("||");
    expect(bond?.n).toBe(2.0);
  });
  it("Vert 3", () => {
    const compiler = createTestCompiler("||||");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(3);
    expect(bond?.n).toBe(3.0);
    expect(bond?.tx).toBe("|||");
    expect(bond?.soft).toBe(false);
  });
  it("Slope Up 3", () => {
    const compiler = createTestCompiler("////");
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(3);
    expect(bond?.n).toBe(3.0);
    expect(bond?.soft).toBe(false);
    expect(bond?.tx).toBe("///");
    expect(String(bond?.dir)).toBe(String(pointFromDeg(-30.0)));
  });
  it("Alt slope up", () => {
    const compiler = createTestCompiler("/");
    compiler.setAltFlag();
    const bond = scanSimpleBond(compiler);
    expect(bond).toBeDefined();
    expect(compiler.pos).toBe(1);
    expect(bond?.n).toBe(1.0);
    expect(bond?.soft).toBe(false);
    expect(bond?.tx).toBe("/");
    expect(String(bond?.dir)).toBe(String(pointFromDeg(150.0)));
  });
});
