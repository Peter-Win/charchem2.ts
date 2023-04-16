import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { makeChemGraph } from "../makeChemGraph";
import { WithStep } from "../traceGraph";
import { findCycles } from "../findCycles";

// Найдены сложные случаи. Пока не ясно, что с ними делать
xdescribe("findCycles", () => {
  it("2 cycles", () => {
    //  index            step
    // 6 / 5 \0_____4   2 / 1 \0 ____1
    //  |     |     |    |     |     |
    // 7 \ 8 /1\ 2 / 3  7 \ 8 /1\ 2 / 2

    const expr = compile("|_q_q_q_q`\\`/|\\/");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    const draft = removeHydrogen(draftH);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    expect(g.vertices.length).toBe(9);
    const cycles = findCycles(g);
    expect(cycles.length).toBe(2);
  });
  it("4 cycles", () => {
    // F|`/|\/`|<`\>/\|`/<`\>|`/`\<`|>`/|O`|`\`|/
    //        index                  step
    //          F(0)                  0
    //          |                     |
    //      2 / 1 \6/ 7 \ 8       2 / 1 \2/ 3 \
    //       |     |     |         |     |     |
    // 17 / 3 \ 4 /5\ 10/ 9    4 / 3\ 4 /3\   /
    //   |      |     |         |     |     |
    // 16 \ 14/ 13\12/ 11        \  /   \  /
    //      ||                     |
    //      O(15)
    const expr = compile("F|`/|\\/`|<`\\>/\\|`/<`\\>|`/`\\<`|>`/|O`|`\\`|/");
    expect(expr.getMessage()).toBe("");
    const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
    const draft = removeHydrogen(draftH);
    const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
    expect(g.vertices.length).toBe(18);
    const cycles = findCycles(g);
    expect(cycles.length).toBe(4);
  });
});
