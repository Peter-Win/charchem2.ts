import { ChemSys } from "../ChemSys";

test("ChemSys.textFormula", () => {
  expect(ChemSys.textFormula("H2SO4", "text")).toBe("H2SO4");
  expect(ChemSys.textFormula("H2S", "TeX")).toBe("\\ce{H_2S}");
});
