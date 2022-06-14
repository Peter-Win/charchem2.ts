import { Point } from "../../../math/Point";
import { HtmlCanvasSurface } from "../HtmlCanvasSurface";
import { parsePath } from "../../utils/parsePath";
import "@testing-library/jest-dom";
import "jest-canvas-mock";

/* eslint no-underscore-dangle: ["error", { "allow": ["__getPath"] }] */

const createSurface = (): HtmlCanvasSurface => {
  const canvas = document.createElement("canvas");
  return new HtmlCanvasSurface(canvas);
};

describe("HtmlCanvasSurface", () => {
  it("drawPath", () => {
    const surface = createSurface();
    surface.setSize(new Point(8, 6));
    surface.drawPath(new Point(1, 1), parsePath("M0 0h5v3h-5z"), {
      stroke: "white",
    });
    expect(surface.getCanvas()).toHaveAttribute("width", "8");
    expect(surface.getCanvas()).toHaveAttribute("height", "6");
    expect(
      surface
        .getCtx()
        .__getPath()
        .map(({ type, props }) => ({ type, props }))
    ).toEqual([
      { type: "beginPath", props: {} },
      { type: "moveTo", props: { x: 0, y: 0 } },
      { type: "lineTo", props: { x: 5, y: 0 } },
      { type: "lineTo", props: { x: 5, y: 3 } },
      { type: "lineTo", props: { x: 0, y: 3 } },
      { type: "lineTo", props: { x: 0, y: 0 } },
    ]);
  });
});
