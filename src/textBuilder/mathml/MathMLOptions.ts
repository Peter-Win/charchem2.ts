import { XmlAttrs } from "../../utils/xml/xmlTypes";

export type MathMLOptions = {
  namespace?: boolean | string;
};

export const mathMLRootAttrs = (options?: MathMLOptions): XmlAttrs => {
  const res: XmlAttrs = {};
  let ns = options?.namespace;
  if (ns === undefined || ns === true)
    ns = "http://www.w3.org/1998/Math/MathML";
  if (ns) {
    res.xmlns = ns;
  }
  return res;
};
