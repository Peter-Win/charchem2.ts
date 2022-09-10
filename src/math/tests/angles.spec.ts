import { normalize360 } from "../angles";

describe("angles", () => {
  it("normalize360", () => {
    expect(normalize360(0)).toBe(0);
    expect(normalize360(1)).toBe(1);
    expect(normalize360(-1)).toBe(359);
    expect(normalize360(360)).toBe(0);
    expect(normalize360(361)).toBe(1);
    expect(normalize360(-361)).toBe(359);
  });
});
