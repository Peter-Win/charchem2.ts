import { ChemAtom } from "../ChemAtom";

describe("ChemAtom", () => {
  it("stable", () => {
    const H = new ChemAtom(1, "H", 1.008);
    const T = new ChemAtom(1, "T", 3);
    const c12 = new ChemAtom(6, "C", 12, { stable: true });
    const c14 = new ChemAtom(6, "C", 14, { stable: false });
    expect(H.stable).toBe(true);
    expect(T.stable).toBe(false);
    expect(c12.stable).toBe(true);
    expect(c14.stable).toBe(false);
  });

  it("walk", () => {
    const H = new ChemAtom(26, "Fe", 55.845);
    const v = H.walkExt({
      id: "",
      atom(obj: ChemAtom) {
        this.id = obj.id;
      },
    });
    expect(v.id).toBe("Fe");
  });
});
