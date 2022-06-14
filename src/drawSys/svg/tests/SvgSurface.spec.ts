import { LocalFont } from "../../AbstractSurface";
import { SvgSurface } from "../SvgSurface";
import { Point } from "../../../math/Point";
import { standaloneExportOptions } from "../standaloneExportOptions";
import { parsePath } from "../../utils/parsePath";

class SvgTestSurface extends SvgSurface {
  // eslint-disable-next-line class-methods-use-this
  getFont(): LocalFont {
    throw new Error("Method not implemented.");
  }
}

describe("SvgSurface", () => {
  it("path", () => {
    const surface = new SvgTestSurface();
    surface.setSize(new Point(100, 100));
    surface.drawPath(
      Point.zero,
      parsePath("M 10 10 H 90 V 90 H 10 L 10 10"),
      {}
    );
    // short case
    expect(surface.exportText()).toBe(
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10H90V90H10L10 10" fill="none" />
</svg>`
    );
    // full case
    expect(surface.exportText(standaloneExportOptions)).toBe(
      `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
  <path d="M10 10H90V90H10L10 10" fill="none" />
</svg>`
    );
  });
  it("path with org", () => {
    const surface = new SvgTestSurface();
    surface.setSize(new Point(110, 110));
    surface.drawPath(
      new Point(10, 10),
      parsePath("M 10 10 H 90 V 90 H 10 L 10 10"),
      {}
    );
    // short case
    expect(surface.exportText()).toBe(
      `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10H90V90H10L10 10" fill="none" transform="translate(10,10)" />
</svg>`
    );
  });
});
