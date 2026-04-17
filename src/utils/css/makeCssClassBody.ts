import { XmlAttrs } from "../xml/xmlTypes";

export const makeCssClassBody = (props: XmlAttrs): string =>
  Object.entries(props)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
