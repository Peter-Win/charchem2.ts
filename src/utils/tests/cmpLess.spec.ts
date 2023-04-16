import { cmpLess } from "../cmp";

describe("cmpLess", () => {
  const less = (a: string, b: string) => a.toUpperCase() < b.toUpperCase();
  it("direct call", () => {
    expect(cmpLess(less)("A", "a")).toBe(0);
    expect(cmpLess(less)("Hello", "Bye")).toBe(1);
    expect(cmpLess(less)("world", "zero")).toBe(-1);
  });
  it("sort", () => {
    const list = ["world", "A", "22", "hello", "Z"];
    list.sort(cmpLess(less));
    expect(list).toEqual(["22", "A", "hello", "world", "Z"]);
  });
});
