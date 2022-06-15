import { ElemList } from "../ElemList";
import { PeriodicTable } from "../PeriodicTable";
import { ElemRecord } from "../ElemRecord";
import { ChemRadical } from "../ChemRadical";

describe("ElemList", () => {
  it("addElemById", () => {
    const list = new ElemList().addElemById("H", 2).addElemById("O");
    expect(String(list)).toBe("H2O");
    list.addElemById("O");
    expect(String(list)).toBe("H2O2");
  });
  it("addAtom", () => {
    const { dict } = PeriodicTable;
    const list = new ElemList()
      .addAtom(dict.Cu)
      .addAtom(dict.S)
      .addAtom(dict.O, 4);
    expect(String(list)).toBe("CuSO4");
  });
  it("addCustom", () => {
    const list = new ElemList().addCustom("Pr", 2).addCustom("Ar");
    expect(String(list)).toBe("{Pr}2{Ar}");
  });
  it("addElem", () => {
    const { dict } = PeriodicTable;
    const list = new ElemList()
      .addElem(new ElemRecord("M"))
      .addElem(new ElemRecord(dict.N))
      .addElem(new ElemRecord(dict.O, 3));
    expect(String(list)).toBe("{M}NO3");
  });
  it("addList", () => {
    const { dict } = PeriodicTable;
    const listA = new ElemList().addAtom(dict.Al, 2).addAtom(dict.O, 3);
    const listB = new ElemList().addElemById("C").addAtom(dict.O, 2);
    listA.addList(listB);
    expect(String(listA)).toBe("Al2O5C");
    listA.addElemById("O");
    expect(String(listA)).toBe("Al2O6C");
    expect(String(listB)).toBe("CO2"); // not changed
  });
  it("addList with charges", () => {
    const { dict } = PeriodicTable;
    const listA = new ElemList().addElemById("N").addAtom(dict.O, 3);
    listA.charge = -1;
    expect(String(listA)).toBe("NO3^-");
    const listB = new ElemList().addElemById("N").addAtom(dict.H, 4);
    listB.charge = 1;
    expect(String(listB)).toBe("NH4^+");
    listA.addList(listB);
    expect(String(listA)).toBe("N2O3H4");
  });
  it("addRadical", () => {
    const list = new ElemList()
      .addElemById("Cl")
      .addRadical(ChemRadical.dict.Ph);
    expect(String(list)).toBe("ClC6H5");
  });
  it("scale", () => {
    const { dict } = PeriodicTable;
    const list = new ElemList().addElemById("S").addAtom(dict.O, 4);
    list.charge = -2;
    expect(String(list)).toBe("SO4^2-");
    list.scale(3);
    expect(String(list)).toBe("S3O12^6-");
  });

  it("findAtom", () => {
    const { dict } = PeriodicTable;
    const a = new ElemList()
      .addElemById("H")
      .addElemById("D")
      .addAtom(dict.Br, 4);
    expect(a.findAtom(dict.H)).toBe(a.list[0]);
    expect(a.findAtom(PeriodicTable.isotopesDict.D)).toBe(a.list[1]);
    expect(a.findAtom(dict.Br)).toBe(a.list[2]);
    expect(a.findAtom(dict.Xe)).toBeUndefined();
  });
  it("findById", () => {
    const { dict } = PeriodicTable;
    const a = new ElemList()
      .addElemById("H")
      .addElemById("D")
      .addAtom(dict.Br, 4);
    expect(a.findById("H")).toBe(a.list[0]);
    expect(a.findById("D")).toBe(a.list[1]);
    expect(a.findById("Br")).toBe(a.list[2]);
    expect(a.findById("Xe")).toBeUndefined();
  });
  it("findCustom", () => {
    const a = new ElemList().addElemById("Ar").addCustom("Ar");
    expect(a.findCustom("Ar")).toBe(a.list[1]);
    expect(a.findById("Ar")).toBe(a.list[0]);
  });
  it("findKey", () => {
    const a = new ElemList().addElemById("Pr").addCustom("Pr");
    expect(a.findKey("{Pr}")).toBe(a.list[1]);
    expect(a.findKey("Pr")).toBe(a.list[0]);
  });
  it("findRec", () => {
    const { dict } = PeriodicTable;
    const a = new ElemList()
      .addAtom(dict.C, 6)
      .addAtom(dict.H, 4)
      .addCustom("R", 2);
    const b = new ElemList()
      .addCustom("R")
      .addAtom(dict.C, 2)
      .addAtom(dict.H, 5);
    expect(a.findRec(b.list[0])).toBe(a.list[2]);
    expect(a.findRec(b.list[1])).toBe(a.list[0]);
    expect(a.findRec(b.list[2])).toBe(a.list[1]);
  });
  it("sortByHill", () => {
    const a = new ElemList()
      .addCustom("R1")
      .addElemById("S")
      .addElemById("O")
      .addElemById("H", 2)
      .addElemById("C")
      .addElemById("O")
      .addCustom("R2");
    expect(String(a)).toBe("{R1}SO2H2C{R2}");
    a.sortByHill();
    expect(String(a)).toBe("CH2O2S{R1}{R2}");
  });
});
