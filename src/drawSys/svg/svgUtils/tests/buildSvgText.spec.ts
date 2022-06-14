import { Point } from "../../../../math/Point";
import { standaloneExportOptions } from "../../standaloneExportOptions";
import { buildSvgText } from "../buildSvgText";

const picture1 = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" width="110px" height="100px">
  <defs>
    <circle id="fig1" cx="0" cy="0" r="4" fill="red" />
  </defs>
  <path d="M 10 10 H 90 V 90 H 10 L 10 10"/>
  <use xlink:href="#fig1" transform="translate(10, 10)" />
  <use xlink:href="#fig1" transform="translate(90, 90)" />
</svg>`;

describe("buildSvgText", () => {
  it("with defs", () => {
    const size = new Point(100, 100);
    const defs: Record<string, string> = {
      fig1: `<circle id="fig1" cx="0" cy="0" r="4" fill="red" />`,
    };
    const body: string[] = [
      `<path d="M 10 10 H 90 V 90 H 10 L 10 10"/>`,
      `<use xlink:href="#fig1" transform="translate(10, 10)" />`,
      `<use xlink:href="#fig1" transform="translate(90, 90)" />`,
    ];
    const dst = buildSvgText(size, defs, body, {
      ...standaloneExportOptions,
      width: "110px",
      height: "100px",
    });
    expect(dst).toBe(picture1);
  });
});
