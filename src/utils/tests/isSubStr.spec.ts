import { isSubStr } from "../isSubStr";

describe("isSubStr", () => {
  it("full equal", () => {
    expect(isSubStr("Hello", 0, "Hello")).toBe(true);
  });
  it("subStr is part of a text", () => {
    expect(isSubStr("Hello, world!", 7, "world")).toBe(true);
    expect(isSubStr("Hello, world!", 7, "wor")).toBe(true);
    expect(isSubStr("Hello, world!", 6, "world")).toBe(false);
  });
  it("subStr is out of a text", () => {
    expect(isSubStr("Hello", 0, "Hello!")).toBe(false);
  });
});
