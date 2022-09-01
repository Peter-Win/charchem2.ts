import { FigFrame } from "../../drawSys/figures/FigFrame";
import { createTestStyle, createTestSurface } from "./testEnv";
import { drawText } from "../drawText";
import { Rect } from "../../math/Rect";

it("drawText", () => {
  const frame = new FigFrame();
  const surface = createTestSurface();
  const style = createTestStyle(surface, 20);
  const fig = drawText(frame, "COOH", style);
  frame.update();

  expect(fig.text).toBe("COOH");
  expect(fig.font).toBe(style.font);
  expect(fig.style).toBe(style.style);
  expect(fig.org.toString()).toBe("(0, 0)");
  const { ascent, descent } = fig.font.getFontFace();
  const w = fig.font.getTextWidth("COOH");
  const rcExpected = new Rect(0, -ascent, w, -descent);
  expect(fig.bounds.toString()).toBe(rcExpected.toString());
  expect(frame.bounds).not.toBe(fig.bounds);
  expect(frame.bounds).toEqual(fig.bounds);
});
