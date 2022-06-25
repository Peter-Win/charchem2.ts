import { Int } from "../../../types";
import { scanPar } from "../scanPar";

const getPar = (src: string, pos: Int): string => {
  const end = scanPar(src, pos);
  return src.slice(pos, end);
};

describe("scanPar", () => {
  it("Comma", () => {
    expect(getPar("hello,world", 0)).toBe("hello");
    expect(getPar("hello,world", 6)).toBe("world");
  });

  it("Bracket", () => {
    expect(getPar("(abc,d)", 1)).toBe("abc");
    expect(getPar("(abc,d)", 5)).toBe("d");
  });

  it("NestedBracket", () => {
    expect(getPar("a,rgb(255,0,0),z", 2)).toBe("rgb(255,0,0)");
    expect(getPar("A(B(x,y), C(1,2)), Z()", 0)).toBe("A(B(x,y), C(1,2))");
    expect(getPar("(first(second(a,b)))", 1)).toBe("first(second(a,b))");
  });

  it("Comment", () => {
    expect(getPar(`"hello,world"`, 0)).toBe(`"hello,world"`);
    expect(getPar(`"hello,world",second`, 0)).toBe(`"hello,world"`);
    expect(getPar(`print("a,b,c",2)`, 0)).toBe(`print("a,b,c",2)`);
    expect(getPar(`print(")")`, 0)).toBe(`print(")")`);
  });
});
