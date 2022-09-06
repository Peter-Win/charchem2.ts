import { XmlAttrs } from "../../utils/xml/xmlTypes";

export interface SvgExportOptions {
  xml?: XmlAttrs; // if undefined: no <?xml>
  doctype?: string; // if undefined: no doctype
  svg?: XmlAttrs; // if undefined: version="1.1" xmlns="http://www.w3.org/2000/svg"
  // width and height - special svg attributes. More prior then svg fields.
  width?: string;
  height?: string;
  metadata?: string;
  excludeVerInfo?: boolean;
}
