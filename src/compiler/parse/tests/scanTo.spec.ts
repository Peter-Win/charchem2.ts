import { createTestCompiler } from "../../ChemCompiler";
import { scanTo } from "../scan";

describe("scanTo", () => {
  it("ScanToFinal", () => {
    const compiler = createTestCompiler('A"123"');
    compiler.pos = 2;
    const res = scanTo(compiler, '"');
    expect(res).toBe(true);
    expect(compiler.subStr(2)).toBe("123");
    expect(compiler.pos).toBe(compiler.text.lastIndexOf('"'));
  });
});
