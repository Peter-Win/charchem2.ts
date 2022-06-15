import { ElemRecord } from "../ElemRecord";
import { PeriodicTable } from "../PeriodicTable";

describe("ElemRecord", () => {
  it("real element from string", () => {
    const elemRec = new ElemRecord("Li");
    expect(elemRec.id).toBe("Li");
    expect(elemRec.elem).not.toBeNull();
    expect(elemRec.elem?.n).toBe(3);
    expect(elemRec.elem?.id).toBe("Li");
    expect(elemRec.n).toBe(1.0);
    expect(elemRec.key).toBe("Li");
  });
  it("custom item from string", () => {
    const elemRec = new ElemRecord("Ar", 2.0, true);
    expect(elemRec.id).toBe("Ar");
    expect(elemRec.elem).toBeUndefined();
    expect(elemRec.n).toBe(2.0);
    expect(elemRec.key).toBe("{Ar}");
  });
  it("use ChemAtom", () => {
    const elemRec = new ElemRecord(PeriodicTable.dict.Be);
    expect(elemRec.id).toBe("Be");
    expect(elemRec.elem).not.toBeNull();
    expect(elemRec.elem?.n).toBe(4);
    expect(elemRec.elem?.id).toBe("Be");
    expect(elemRec.n).toBe(1.0);
    expect(elemRec.key).toBe("Be");
  });
  it("use another ElemRecord", () => {
    const src = new ElemRecord("D", 2, false);
    const elemRec = new ElemRecord(src, 3);
    expect(elemRec.id).toBe("D");
    expect(elemRec.elem).not.toBeNull();
    expect(elemRec.elem?.n).toBe(1);
    expect(elemRec.elem?.id).toBe("D");
    expect(elemRec.n).toBe(6.0);
    expect(elemRec.key).toBe("D");
  });
  it("use another abstract ElemRecord", () => {
    const src = new ElemRecord("i-But");
    const elemRec = new ElemRecord(src, 3);
    expect(elemRec.id).toBe("i-But");
    expect(elemRec.elem).toBeUndefined();
    expect(elemRec.n).toBe(3.0);
    expect(elemRec.key).toBe("{i-But}");
  });
});
