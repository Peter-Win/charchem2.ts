import { Locant } from "./Locant";
import { LocantsSet } from "./LocantsSet";

describe("LocantsSet", () => {
  it("toString", () => {
    expect(LocantsSet.createNums([1, 2, 4, 5]).toString()).toBe("1,2,4,5");
    const locs1 = [
      Locant.create("N"),
      Locant.create("α"),
      Locant.create(1),
      Locant.create(1, 1),
    ];
    expect(new LocantsSet(locs1).toString()).toBe("<i>N</i>,α,1,1′");
  });
  // P-14.3.5 Lowest set of locants
  it("less", () => {
    // 1,1,1,4,2 is lower than 1,1,4,4,2
    const [a1, a2] = [
      LocantsSet.createNums([1, 1, 1, 4, 2]),
      LocantsSet.createNums([1, 1, 4, 4, 2]),
    ];
    expect(`${a1} < ${a2}`).toBe("1,1,1,4,2 < 1,1,4,4,2");
    expect(a1.less(a2)).toBe(true);
    expect(a2.less(a1)).toBe(false);

    // 1,1′,2′,1′′,3′′,1′′′ is lower than 1,1′,3′,1′′,2′′,1′′′
    const b1 = LocantsSet.create([[1], [1, 1], [2, 1], [1, 2], [3, 2], [1, 3]]);
    const b2 = LocantsSet.create([[1], [1, 1], [3, 1], [1, 2], [2, 2], [1, 3]]);
    expect(`${b1} is lower than ${b2}`).toBe(
      "1,1′,2′,1′′,3′′,1′′′ is lower than 1,1′,3′,1′′,2′′,1′′′"
    );
    expect(b1.less(b2)).toBe(true);
    expect(b2.less(b1)).toBe(false);

    // N,α,1,2 is lower than 1,2,4,6
    const c1 = LocantsSet.create([["N"], ["α"], [1], [2]]);
    const c2 = LocantsSet.createNums([1, 2, 4, 6]);
    expect(`${c1} is lower than ${c2}`).toBe(
      "<i>N</i>,α,1,2 is lower than 1,2,4,6"
    );
  });
});
