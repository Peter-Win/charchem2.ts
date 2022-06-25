import { makeTextFormulaSrc } from "../../inspectors/makeTextFormula";
import { rulesHtml } from "../../textRules/rulesHtml";
import { pointFromDeg } from "../../math/Point";
import { compile } from "../compile";
import { getVersion } from "../../getVersion";

const sDir = (deg: number): string => String(pointFromDeg(deg));

describe("Functions", () => {
  it("Mass", () => {
    expect(makeTextFormulaSrc("$M(16)O", rulesHtml)).toBe("<sup>16</sup>O");
    expect(makeTextFormulaSrc("$nM(235)U", rulesHtml)).toBe(
      `<span class="echem-mass-and-num">235<br/>92</span>U`
    );
    expect(makeTextFormulaSrc("$nM(1,0){n}", rulesHtml)).toBe(
      `<span class="echem-mass-and-num">1<br/>0</span><i>n</i>`
    );
  });
  it("Slope", () => {
    const expr = compile("$slope(20)/$slope(40)/$slope(60)/$slope(0)/");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.bonds).toHaveLength(4);
    expect(String(agent.bonds[0]!.dir)).toBe(sDir(-20.0));
    expect(String(agent.bonds[1]!.dir)).toBe(sDir(-40.0));
    expect(String(agent.bonds[2]!.dir)).toBe(sDir(-60.0));
    expect(String(agent.bonds[3]!.dir)).toBe(sDir(-30.0));
  });
  it("L", () => {
    const expr = compile("|$L(2)-$L(1.5)`|$L()`-");
    expect(expr.getMessage()).toBe("");
    const n = expr.getAgents()[0]!.nodes;
    expect(n).toHaveLength(5);
    expect(String(n[0]!.pt)).toBe("(0, 0)");
    expect(String(n[1]!.pt)).toBe("(0, 1)");
    expect(String(n[2]!.pt)).toBe("(2, 1)");
    expect(String(n[3]!.pt)).toBe("(2, -0.5)");
    expect(String(n[4]!.pt)).toBe("(1, -0.5)");
  });
  it("Ver", () => {
    const [hiVer, lowVer] = getVersion();
    const curVer = `${hiVer}.${lowVer}`;
    expect(compile("$ver()H2").getMessage()).toBe("");
    expect(compile("$ver(1)H2").getMessage()).toBe("");
    expect(compile(`$ver(${hiVer + 1})H2`).getMessage("en")).toBe(
      `Formula requires CharChem version ${hiVer + 1}.0 instead of ${curVer}`
    );
    expect(compile(`$ver(${hiVer},${lowVer + 1})H2`).getMessage("en")).toBe(
      `Formula requires CharChem version ${hiVer}.${
        lowVer + 1
      } instead of ${curVer}`
    );
    expect(compile(`$ver(${hiVer}.${lowVer + 1}.4)`).getMessage("ru")).toBe(
      `Для формулы требуется CharChem версии ${hiVer}.${
        lowVer + 1
      } вместо ${curVer}`
    );
  });
});
