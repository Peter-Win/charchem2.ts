import { ChemOp } from "../../core/ChemOp";
import { compile } from "../compile";
import { getSrcItemsForObject } from "./getSrcItemsForObject";

describe("opSrcMap", () => {
  it("simple", () => {
    //                     1
    //           0123456789012345678
    const src = "C  +  O2  -->  CO2";
    const expr = compile(src, { srcMap: true });
    expect(expr.getMessage()).toBe("");
    expect(expr.srcMap).toBeDefined();
    const ops: ChemOp[] = [];
    expr.walk({
      operation(obj: ChemOp) {
        ops.push(obj);
      },
    });
    expect(ops.map((op) => op.srcText)).toEqual(["+", "-->"]);

    const d1 = getSrcItemsForObject(ops[0]!, expr.srcMap);
    expect(d1[0]).toBeDefined();
    expect(d1.length).toBe(1);
    expect(d1[0]!.begin).toBe(3);
    expect(d1[0]!.end).toBe(4);

    const d2 = getSrcItemsForObject(ops[1]!, expr.srcMap);
    expect(d2.length).toBe(1);
    expect(d2[0]).toBeDefined();
    expect(d2[0]!.begin).toBe(10);
    expect(d2[0]!.end).toBe(13);
  });

  it("with comments", () => {
    //                     1
    //           01234567890123456789
    const src = `CaCO3 "Up"-->"Down" CaO + O2`;
    const expr = compile(src, { srcMap: true });
    expect(expr.getMessage()).toBe("");
    expect(expr.srcMap).toBeDefined();
    const ops: ChemOp[] = [];
    expr.walk({
      operation(obj: ChemOp) {
        ops.push(obj);
      },
    });
    expect(ops.map((op) => op.srcText)).toEqual(["-->", "+"]);

    const d1 = getSrcItemsForObject(ops[0]!, expr.srcMap);
    expect(d1[0]).toBeDefined();
    expect(d1.length).toBe(1);
    expect(d1[0]!.begin).toBe(6);
    expect(d1[0]!.end).toBe(19);
  });
});
