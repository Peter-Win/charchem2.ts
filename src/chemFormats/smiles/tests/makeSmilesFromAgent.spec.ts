import { compile } from "../../../compiler/compile";
import { makeSmilesFromAgent } from "../makeSmilesFromAgent";
import { ChemAgent } from "../../../core/ChemAgent";
import { makeGraphFromAgent } from "../../../graph/makeGraphFromAgent";
import { removeHydrogen } from "../../../graph/removeHydrogens";
import { textFormula } from "../../../textBuilder/textFormula";

const compileAgent = (ccCode: string): ChemAgent =>
  compile(ccCode).getAgents()[0]!;

describe("makeSmilesFromAgent", () => {
  it("Ethanol", () => {
    const agent = compileAgent("CH3-CH2-OH");
    expect(makeSmilesFromAgent(agent)).toBe("CCO");
    const withSingleBonds = makeSmilesFromAgent(agent, {
      forceSingleBonds: true,
    });
    expect(withSingleBonds).toBe("C-C-O");
  });

  it("hydrogen mode", () => {
    const agent = compileAgent("H2O");
    expect(makeSmilesFromAgent(agent)).toBe("O");
    expect(makeSmilesFromAgent(agent, { hydrogen: "hidden" })).toBe("O");
    expect(makeSmilesFromAgent(agent, { hydrogen: "included" })).toBe("[OH2]");
    expect(makeSmilesFromAgent(agent, { hydrogen: "separated" })).toBe(
      "[H]O[H]"
    );
    expect(
      makeSmilesFromAgent(agent, {
        hydrogen: "separated",
        forceSingleBonds: true,
      })
    ).toBe("[H]-O-[H]");
    expect(
      makeSmilesFromAgent(agent, {
        hydrogen: "separated",
        forceSingleBonds: true,
        disableOrganicSubset: true,
      })
    ).toBe("[H]-[O]-[H]");
  });

  it("hydrides", () => {
    expect(makeSmilesFromAgent(compileAgent("LiH"))).toBe("[LiH]");
    expect(makeSmilesFromAgent(compileAgent("Li-H"))).toBe("[LiH]");
    expect(
      makeSmilesFromAgent(compileAgent("LiH"), { hydrogen: "separated" })
    ).toBe("[Li][H]");

    const agentB = compileAgent("H-B<|H>-H");
    expect(makeSmilesFromAgent(agentB)).toBe("B");
    expect(makeSmilesFromAgent(agentB, { hydrogen: "included" })).toBe("[BH3]");
    expect(makeSmilesFromAgent(agentB, { hydrogen: "separated" })).toBe(
      "[H]B([H])[H]"
    );

    expect(makeSmilesFromAgent(compileAgent("SH2"))).toBe("S");
    expect(makeSmilesFromAgent(compileAgent("TeH2"))).toBe("[TeH2]");
  });

  it("bonds", () => {
    expect(makeSmilesFromAgent(compileAgent("O=C=O"))).toBe("O=C=O");
    expect(makeSmilesFromAgent(compileAgent("C=O"))).toBe("[C]=O");
    expect(makeSmilesFromAgent(compileAgent("H-C%N"))).toBe("C#N");
    expect(
      makeSmilesFromAgent(compileAgent("H-C%N"), { hydrogen: "separated" })
    ).toBe("[H]C#N");
  });

  it("branches", () => {
    // propionic acid
    const agentP = compileAgent("/\\|O`|/OH");
    const draft = removeHydrogen(makeGraphFromAgent(agentP));
    expect(draft.edges.map(({ mul }) => mul)).toEqual([1, 1, 2, 1]);
    expect(
      draft.vertices.map(
        ({ content, hydrogen }) =>
          textFormula(content, "text") + (hydrogen || 0)
      )
    ).toEqual(["C3", "C2", "C0", "O0", "O1"]);
    expect(makeSmilesFromAgent(agentP)).toBe("CCC(=O)O");
    // fluoroform
    expect(makeSmilesFromAgent(compileAgent("F-CH<`|F>-F"))).toBe("FC(F)F");
    // bromochlorodifluoromethane
    expect(makeSmilesFromAgent(compileAgent("F-C<`|Br><|Cl>-F"))).toBe(
      "FC(Cl)(Br)F"
    );
  });

  // Здесь нужен цикл. Иначе на концах получается не целое количество атомов водорода. Но цикл пока с бранчем
  it("aromatic bonds. explicit", () => {
    const agent = compileAgent(
      "_(A-90,N1.5,S:|)_(A0,N1.5,S:|)_(A90,N1.5,S:|)_(A180,N1.5,S:|)"
    );
    expect(agent.bonds.length).toBe(4);
    expect(agent.bonds[0]!.n).toBe(1.5);
    expect(makeSmilesFromAgent(agent, { forceAromaticBonds: true })).toBe(
      "C(:C:1):C:C1"
    );
  });

  it("charges", () => {
    expect(makeSmilesFromAgent(compileAgent("Na^+/0Cl^-"))).toBe("[Na+].[Cl-]");
    expect(makeSmilesFromAgent(compileAgent("H^+"))).toBe("[H+]");
    expect(makeSmilesFromAgent(compileAgent("H3O^+/0OH^-"))).toBe(
      "[OH3+].[OH-]"
    );
    const agentB = compileAgent("B^3+");
    expect(makeSmilesFromAgent(agentB)).toBe("[B+3]");
    expect(makeSmilesFromAgent(agentB, { expandCharge: true })).toBe("[B+++]");
  });
  it("isotopes", () => {
    expect(makeSmilesFromAgent(compileAgent("$M(14)C"))).toBe("[14C]");
    expect(makeSmilesFromAgent(compileAgent("D2O"))).toBe("[2H]O[2H]");
    expect(makeSmilesFromAgent(compileAgent("D^+"))).toBe("[2H+]");
  });

  // Пока отложена раскрутка циклов, т.к. найдены сложные случаи (см findCycles), с которыми пока непонятно что делать
  xit("Rings", () => {
    expect(makeSmilesFromAgent(compileAgent("O\\|`/O`\\`|/"))).toBe("O1CCOCC1");
  });

  // https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system#Examples
  it("Dinitrogen", () => {
    const agent = compileAgent("N2");
    const draft = makeGraphFromAgent(agent);
    expect(draft.toString()).toBe("v0: N*3; v1: N*3; e0: 0-1*3");
    const smiles = makeSmilesFromAgent(agent);
    expect(smiles).toBe("N#N");
  });
  it("Methyl isocyanate", () => {
    expect(makeSmilesFromAgent(compileAgent("CH3-N=C=O"))).toBe("CN=C=O");
  });
});
