import { ElemList } from "../../core/ElemList";
import { checkElementsMatching } from "../checkElementsMatching";

describe("checkElementsMatching", () => {
  it("no error", () => {
    const left = new ElemList().addElemById("H", 2).addElemById("O");
    const right = new ElemList().addElemById("O").addElemById("H");
    const res = checkElementsMatching([left, right]);
    expect(res).toBeUndefined();
  });

  it("expect element in right part", () => {
    const left = new ElemList().addElemById("H", 2).addElemById("O");
    const right = new ElemList().addElemById("H");
    const res = checkElementsMatching([left, right]);
    expect(res).toBeDefined();
    expect(res![0]).toBe("[E] is missing in [S] part");
    expect(res![1]).toEqual({ E: "O", S: "right|part" });
  });

  it("expect element in left part", () => {
    const left = new ElemList().addElemById("H", 2);
    const right = new ElemList().addElemById("H").addElemById("S");
    const res = checkElementsMatching([left, right]);
    expect(res).toBeDefined();
    expect(res![0]).toBe("[E] is missing in [S] part");
    expect(res![1]).toEqual({ E: "S", S: "left|part" });
  });
});
