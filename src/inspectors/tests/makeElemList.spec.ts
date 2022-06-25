import { compile } from "../../compiler/compile";
import { makeElemList } from "../makeElemList";

describe("makeElemList", () => {
  it("Simple", () => {
    const expr = compile("H2O");
    expect(expr.getMessage()).toBe("");
    const elList = makeElemList(expr);
    expect(elList.toString()).toBe("H2O");
  });
  it("SimpleCharge", () => {
    const expr = compile("SO4^2-");
    expect(expr.getMessage()).toBe("");
    const elList = makeElemList(expr);
    expect(elList.toString()).toBe("SO4^2-");
  });
  it("Node", () => {
    const expr = compile("CH3CH2COOH");
    expect(expr.getMessage()).toBe("");
    const elList = makeElemList(expr);
    expect(elList.toString()).toBe("C3H6O2");
  });
  it("Brackets With Charge", () => {
    const expr = compile("[Fe(CN)6]2^3-");
    expect(expr.getMessage()).toBe("");
    const elList = makeElemList(expr);
    expect(elList.toString()).toBe("Fe2C12N12^6-");
  });
  it("Multiplier", () => {
    const expr = compile("MgCl2*12H2O");
    expect(expr.getMessage()).toBe("");
    const elList = makeElemList(expr);
    expect(elList.toString()).toBe("MgCl2H24O12");
  });
});
