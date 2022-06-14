import { Point } from "../../../math/Point";
import { XmlAttrs } from "../../../utils/xml/xmlTypes";
import { SvgExportOptions } from "../SvgExportOptions";
import { drawTag } from "../../../utils/xml/drawTag";

export const buildSvgText = (
  size: Point,
  defs: Record<string, string>,
  body: string[],
  options: SvgExportOptions
): string => {
  let result = "";
  const { xml, doctype, svg } = options;
  if (xml) {
    result += `${drawTag("?xml", xml, true).replace("/>", "?>")}\n`;
  }
  if (doctype) {
    result += `<!DOCTYPE ${doctype}>\n`;
  }
  const rootAttrs: XmlAttrs = {
    viewBox: `0 0 ${size.x} ${size.y}`,
    ...svg,
  };
  if (options.width) rootAttrs.width = options.width;
  if (options.height) rootAttrs.height = options.height;
  if (!("xmlns" in rootAttrs)) {
    rootAttrs.xmlns = "http://www.w3.org/2000/svg";
  }
  result += `${drawTag("svg", rootAttrs)}\n`;
  const defsList = Object.keys(defs);
  if (defsList.length > 0) {
    result += `  <defs>\n`;
    defsList.forEach((key: string) => {
      result += `    ${defs[key]}\n`;
    });
    result += `  </defs>\n`;
  }
  body.forEach((s) => {
    result += `  ${s}\n`;
  });
  result += `</svg>`;
  return result;
};
