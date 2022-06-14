import { SvgExportOptions } from "./SvgExportOptions";

/**
 * This options can be useful for non-standalone SVG creating
 */
export const standaloneExportOptions: SvgExportOptions = Object.freeze({
  xml: {
    version: "1.0",
    encoding: "UTF-8",
    standalone: "no",
  },
  doctype: `svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"`,
  svg: {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    baseProfile: "full",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "xmlns:ev": "http://www.w3.org/2001/xml-events",
  },
});
