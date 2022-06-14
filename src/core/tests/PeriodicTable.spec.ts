import { findElement, PeriodicTable } from "../PeriodicTable";

describe("findElement", () => {
  it("element", () => {
    expect(findElement("He")).toHaveProperty("n", 2);
    expect(findElement("Rn")).toHaveProperty("mass", 222);
  });
  it("isotope", () => {
    const d = findElement("D");
    expect(d).toHaveProperty("n", 1);
    expect(d).toHaveProperty("stable", true);
    const t = findElement("T");
    expect(t).toHaveProperty("n", 1);
    expect(t).toHaveProperty("stable", false);
  });
  it("not found", () => {
    const wrong = findElement("Me");
    expect(wrong).toBeUndefined();
  });
});

describe("PeriodicTable", () => {
  it("elements", () => {
    const { elements } = PeriodicTable;
    expect(elements).toHaveLength(118);
    expect(elements[0]).toHaveProperty("id", "H");
    expect(elements[elements.length - 1]).toHaveProperty("id", "Og");
  });
  it("dict", () => {
    const { dict } = PeriodicTable;
    expect(dict.B).toHaveProperty("n", 5);
    expect(dict.C).toHaveProperty("n", 6);
    expect(dict.F).toHaveProperty("n", 9);
  });
  it("isotopes", () => {
    const { isotopes } = PeriodicTable;
    expect(isotopes).toHaveLength(2);
    expect(isotopes[0]).toHaveProperty("id", "D");
    expect(isotopes[1]).toHaveProperty("id", "T");
  });
  it("isotopesDict", () => {
    const { isotopesDict } = PeriodicTable;
    expect(isotopesDict.D).toHaveProperty("n", 1);
    expect(isotopesDict.D).toHaveProperty("stable", true);
    expect(isotopesDict.T).toHaveProperty("n", 1);
    expect(isotopesDict.T).toHaveProperty("stable", false);
  });
});
