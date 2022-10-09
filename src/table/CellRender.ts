import { ChemAtom } from "../core/ChemAtom";
import { Lang } from "../lang/Lang";
import { drawTag } from "../utils/xml/drawTag";
import { escapeXml } from "../utils/xml/escapeXml";

const div = (
  cls: string,
  value: string | number,
  attrs?: Record<string, string>,
  tag?: string
): string =>
  `${
    drawTag(tag ?? "div", { ...attrs, class: cls }) + escapeXml(String(value))
  }</div>`;

export type FieldRenderFn = (elem: ChemAtom, stdOut: typeof div) => string;

export type CellRenderField = "number" | "id" | "name" | "mass";

const fieldsDict: Record<CellRenderField, FieldRenderFn> = {
  number: (elem, stdOut) => stdOut("number", elem.n),
  id: (elem, stdOut) => stdOut("id", elem.id),
  name: (elem, stdOut) => stdOut("name", Lang.tr(elem.id)),
  mass: (elem, stdOut) => stdOut("mass", elem.mass),
};

export class CellRender {
  fields: FieldRenderFn[];

  constructor(
    fields: (CellRenderField | FieldRenderFn)[] = [
      "number",
      "id",
      "name",
      "mass",
    ]
  ) {
    // В старых JS версиях вместо массива fields может быть строка, разделенная запятыми
    if (typeof fields === "string") {
      // eslint-disable-next-line no-param-reassign
      fields = (fields as unknown as string).split(",") as CellRenderField[];
    }
    this.fields = fields.map((f) =>
      typeof f === "function" ? f : fieldsDict[f]
    );
  }

  draw(elem: ChemAtom): string {
    return this.fields.map((field) => (field ? field(elem, div) : "")).join("");
  }
}
