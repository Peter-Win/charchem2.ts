import { createTestCompiler } from "../../ChemCompiler";
import {
  funcAtomColor,
  funcAtomColor1,
  funcColor,
  funcItemColor,
  funcItemColor1,
} from "../../funcs/funcColor";
import { getAtomColor, getItemColor } from "../colors";

describe("getColors", () => {
  it("getItemColor", () => {
    const compiler = createTestCompiler("");
    expect(getItemColor(compiler)).toBeUndefined();
    funcColor(compiler, ["black"], [0]);
    expect(getItemColor(compiler)).toBe("black");
    funcItemColor1(compiler, ["red"], [0]);
    funcItemColor(compiler, ["green"], [0]);
    expect(getItemColor(compiler)).toBe("red");
    expect(getItemColor(compiler)).toBe("green");
    expect(getItemColor(compiler)).toBe("green");
    funcItemColor(compiler, [], []);
    expect(getItemColor(compiler)).toBe("black");
  });
  it("getAtomColor", () => {
    const compiler = createTestCompiler("");
    expect(getAtomColor(compiler)).toBeUndefined();
    funcColor(compiler, ["#000"], [0]); // Never used in atom color
    funcAtomColor1(compiler, ["orange"], [0]);
    funcAtomColor(compiler, ["magenta"], [0]);
    expect(getAtomColor(compiler)).toBe("orange");
    expect(getAtomColor(compiler)).toBe("magenta");
    expect(getAtomColor(compiler)).toBe("magenta");
    funcAtomColor(compiler, [], []);
    expect(getAtomColor(compiler)).toBeUndefined();
  });
});
