import { FigFrame } from "../../drawSys/figures/FigFrame";
import { drawText } from "../drawText";
import { drawTextNear } from "../drawTextNear";
import {
  createTestImgProps,
  createTestStyle,
  createTestSurface,
} from "./testEnv";
import { getBaseline } from "../../drawSys/utils/fontFaceProps";
import { getTextInternalRect } from "../getTextInternalRect";

describe("drawTextNear", () => {
  it("Right Bottom", () => {
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100);
    const style1 = imgProps.stdStyle;
    const style2 = createTestStyle(surface, 50, "blue");
    const frame = new FigFrame();
    const h = drawText(frame, "H", style1);
    const rcH = getTextInternalRect(h);
    const two = drawTextNear(frame, rcH, "2", imgProps, style2, "RB");
    expect(two.text).toBe("2");
    expect(frame.figures).toHaveLength(2);
    const rc2 = two.getRelativeBounds();
    expect(h.bounds.B.x).toBeCloseTo(rc2.A.x);
    const blH = getBaseline(h.font.getFontFace());
    const bl2 = getBaseline(two.font.getFontFace());
    const subItemHeight = two.font.getFontFace().ascent;
    expect(two.bounds.top + two.org.y + bl2 - (h.bounds.top + blH)).toBeCloseTo(
      subItemHeight * imgProps.subKY
    );
  });
  it("Center Upper", () => {
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100);
    const style1 = imgProps.stdStyle;
    const style2 = createTestStyle(surface, 50, "blue");
    const frame = new FigFrame();
    const o = drawText(frame, "O", style1);
    const rcO = getTextInternalRect(o);
    const ox = drawTextNear(frame, rcO, "+2", imgProps, style2, "CU");
    const rcOx = ox.getRelativeBounds();
    expect(o.bounds.cx).toBeCloseTo(rcOx.cx);
    expect(rcO.top + ox.font.getFontFace().descent).toBeCloseTo(
      rcOx.top + getBaseline(ox.font.getFontFace())
    );
  });
  it("Left bottom", () => {
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100);
    const style1 = imgProps.stdStyle;
    const style2 = createTestStyle(surface, 50, "blue");
    const frame = new FigFrame();
    const main = drawText(frame, "Hg", style1);
    const rcMain = getTextInternalRect(main);
    const sub = drawTextNear(frame, rcMain, "32", imgProps, style2, "LB");
    const rcSub = sub.getRelativeBounds();
    expect(rcSub.right).toBeCloseTo(0);
  });

  it("Right top", () => {
    const surface = createTestSurface();
    const imgProps = createTestImgProps(surface, 100);
    const style1 = imgProps.stdStyle;
    const style2 = createTestStyle(surface, 50, "green");
    const ff2 = style2.font.getFontFace();
    const frame = new FigFrame();
    const main = drawText(frame, "Hg", style1);
    const rcMain = getTextInternalRect(main);
    imgProps.supKY = 0;
    const sub = drawTextNear(frame, rcMain, "2+", imgProps, style2, "RT");
    const rcSub = sub.getRelativeBounds();
    expect(rcSub.left).toBeCloseTo(rcMain.right);
    expect(rcSub.top + getBaseline(ff2) - ff2.ascent).toBeCloseTo(rcMain.top);

    rcMain.B.x = rcSub.B.x;
    imgProps.supKY = 1;
    const sub2 = drawTextNear(frame, rcMain, "3+", imgProps, style2, "RT");
    const rcSub2 = sub2.getRelativeBounds();
    expect(rcSub2.top + getBaseline(ff2)).toBeCloseTo(rcMain.top);
  });
});
