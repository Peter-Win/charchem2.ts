import { isCasNumber } from "../isCasNumber";

describe("isCasNumber", () => {
  it("Success", () => {
    expect(isCasNumber("7732-18-5")).toBe(true); // water
  });
  it("Invalid pattern", () => {
    expect(isCasNumber("")).toBe(false);
    expect(isCasNumber("a")).toBe(false);
    expect(isCasNumber("7732-185")).toBe(false);
  });
  it("Invalid checksum", () => {
    expect(isCasNumber("7732-18-6")).toBe(false);
  });
});
