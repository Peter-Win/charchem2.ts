import { LocalFont } from "../../AbstractSurface";
import { LocalSvgFont } from "../LocalSvgFont";
import { SvgFont } from "../../portableFonts/svgFont/SvgFont";
import { testSvgFontSource } from "../../portableFonts/svgFont/tests/testSvgFontSource";
import { SvgSurface } from "../SvgSurface";
import { getBaseline, getFontHeight } from "../../utils/fontFaceProps";
import { Point } from "../../../math/Point";
import { standaloneExportOptions } from "../standaloneExportOptions";

const expectedImage = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 220.5 120" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
  <defs>
    <path id="HussarBoldWeb-one" d="M29 487v186l235 152h89v-825h-188v575z" />
    <path id="HussarBoldWeb-plus" d="M393 158h-153v180h-180v153h180v180h153v-180h180v-153h-180v-180z" />
  </defs>
  <rect x="10" y="10" width="200.5" height="100" fill="none" stroke="brown" stroke-width="1" />
  <use xlink:href="#HussarBoldWeb-one" transform="matrix(0.1 0 0 -0.1 10 85)" fill="blue" />
  <use xlink:href="#HussarBoldWeb-plus" transform="matrix(0.1 0 0 -0.1 78.60000000000001 85)" fill="blue" />
  <use xlink:href="#HussarBoldWeb-one" transform="matrix(0.1 0 0 -0.1 169.20000000000002 85)" fill="blue" />
  <path d="M0 87.7H147" stroke="black" stroke-width="1" fill="none" />
</svg>`;

class SvgTestSurface extends SvgSurface {
  // eslint-disable-next-line class-methods-use-this
  getFont(): LocalFont {
    throw new Error("Method not implemented.");
  }
}

describe("LocalSvgFont", () => {
  const factory = SvgFont.create(testSvgFontSource);
  const localFont = new LocalSvgFont(factory, {
    family: "Ignored",
    height: 100,
  });
  const scale = 100 / factory.getHeight();
  it("getFontFace", () => {
    const fontFace = localFont.getFontFace();
    expect(fontFace.ascent).toBeCloseTo(factory.fontFace.ascent * scale);
    const needBbox = factory.fontFace.bbox
      ?.map((v) => (v * scale).toFixed(2))
      .join(" ");
    expect(fontFace.bbox?.map((v) => v.toFixed(2)).join(" ")).toBe(needBbox);
    expect(fontFace.capHeight).toBeCloseTo(factory.fontFace.capHeight * scale);
    expect(fontFace.descent).toBeCloseTo(factory.fontFace.descent * scale);
    expect(fontFace.fontFamily).toBe("Hussar");
    expect(fontFace.fontStretch).toBe("normal");
    expect(fontFace.fontStyle).toBeUndefined();
    expect(fontFace.fontWeight).toBe("700");
  });
  it("getTextSize", () => {
    const width = localFont.getTextWidth("1 + 1");
    expect(width).toBeCloseTo((413 + 273 + 633 + 273 + 413) * scale);
  });
  it("drawLine", () => {
    const text = "1 + 1";
    const width = localFont.getTextWidth(text);
    const tsize = new Point(width, getFontHeight(localFont.getFontFace()));
    const size = tsize.plus(new Point(20, 20));
    const surface = new SvgTestSurface();
    surface.setSize(size);
    surface.addFigure(
      `<rect x="10" y="10" width="${tsize.x}" height="${tsize.y}" fill="none" stroke="brown" stroke-width="1" />`
    );
    const lff = localFont.getFontFace();
    const baseline = getBaseline(lff);
    localFont.drawLine(surface, new Point(10, 10 + baseline), text, {
      fill: "blue",
    });
    surface.addFigure(
      `<path d="M0 87.7H147" stroke="black" stroke-width="1" fill="none" />`
    );
    const image = surface.exportText({
      ...standaloneExportOptions,
      excludeVerInfo: true,
    });
    expect(image).toBe(expectedImage);
  });
});
