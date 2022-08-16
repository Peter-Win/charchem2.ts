import { createTestImgProps, createTestSurface } from "../../tests/testEnv";
import { compile } from "../../../compiler/compile";
import { PAgentCtx } from "../PAgentCtx";
import { prepareNodes } from "../prepareNodes";
import {
  getBaseline,
  getFontHeight,
} from "../../../drawSys/utils/fontFaceProps";
import { Rect } from "../../../math/Rect";
import { ChemBond } from "../../../core/ChemBond";

describe("processCommands", () => {
  it("Soft bond", () => {
    const expr = compile("H-OH");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0]!;
    expect(agent.commands[1]).toBeInstanceOf(ChemBond);
    const bond = agent.commands[1] as ChemBond;
    expect(String(bond.dir)).toBe("(1, 0)");

    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 40);
    const ctx = new PAgentCtx(agent, imgProps);
    prepareNodes(ctx);

    const locFont = imgProps.stdStyle.font;
    const ff = locFont.getFontFace();
    const baseLine = getBaseline(ff);
    const height = getFontHeight(ff);
    const top = -baseLine;
    const bottom = top + height;

    const cluster1 = ctx.clusters.clusters[0]!;
    const cluster2 = ctx.clusters.clusters[1]!;
    const rc1 = new Rect(0, top, locFont.getTextWidth("H"), bottom);
    rc1.moveXY(-rc1.width / 2, ff.ascent / 2);
    expect(String(cluster1.frame.bounds)).toBe(String(rc1));
    const rc2 = new Rect(0, top, locFont.getTextWidth("OH"), bottom);
    rc2.moveXY(-locFont.getTextWidth("O") / 2, ff.ascent / 2);
    expect(String(cluster2.frame.bounds)).toBe(String(rc2));
  });
});
