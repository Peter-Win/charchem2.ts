import { compile } from "../../../compiler/compile";
import { createStructBuilderCtx } from "../../StructBuilderCtx";
import {
  createTestImgProps,
  createTestSurface,
  saveSurface,
} from "../../tests/testEnv";
import { buildAgentPrior } from "../buildAgentPrior";

describe("buildAgentPrior", () => {
  it("simple soft bond", () => {
    const expr = compile("H-C-CH2-OH; NH3|#2|H");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const { agentFrame } = buildAgentPrior(
      agent,
      createStructBuilderCtx(surface, imgProps),
    );
    saveSurface("buildAgentPrior-1", agentFrame, surface);
  });
});
