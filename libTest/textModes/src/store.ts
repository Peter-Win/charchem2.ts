import { CSSProperties } from "react";
import { makeAutoObservable } from "mobx";
import { ChemExpr } from "charchem2/core/ChemExpr";
import { compile } from "charchem2/compiler/compile";
import { buildTextFormat } from "charchem2/textBuilder/text/buildTextFormat";
import { OptionsHtmlRich } from "charchem2/textBuilder/htmlRich/OptionsHtmlRich";
import { ChemObj } from "charchem2/core/ChemObj";
import { SrcMapItem } from "charchem2/compiler/sourceMap";
import { XmlNode } from "charchem2/textBuilder/xmlNode/XmlNode";
import { idGenBase } from "charchem2/textBuilder/htmlRich/idGenBase";
import { renderXmlNodes } from "charchem2/textBuilder/xmlNode/renderXmlNode";
import { buildTeX, TeXOptions } from "charchem2/textBuilder/tex/buildTeX";
import { htmlPoor } from "charchem2/textBuilder/htmlPoor/htmlPoor";
import { buildCharChemText } from "charchem2/textBuilder/charChem/buildCharChemText";
import { buildTextNodes, TextNode } from "charchem2/textBuilder/buildTextNodes";
import { buildHtmlRich, ResultHtmlRich } from "charchem2/textBuilder/htmlRich/buildHtmlRich";
import { initialTeXSettings } from "./components/ViewTeXFormat/TeXSettings";
import { storageLoad, storageSave } from "./common/storage";
import {
  initialPoorHtmlSettings,
  PoorHtmlSettings,
} from "./components/ViewPoorHtmlFormat";
import {
  initialTextSettings,
  makeTextOptions,
  TextSettings,
} from "./components/ViewTextFormat/TextSettings";
import {
  defaultFormulaViewSettings,
  FormulaViewSettings,
} from "./components/FormulaViewSettings";

export type SectionKey =
  | "RichHtml"
  | "MathML"
  | "TeX"
  | "Text"
  | "PoorHtml"
  | "CharChem";
const visibilityKey = "sections";

export const store = makeAutoObservable({
  formula: "",
  setFormula(code: string) {
    this.formula = code;
  },
  get expr(): ChemExpr | undefined {
    if (!this.formula) return undefined;
    const e = compile(this.formula, { srcMap: true });
    return e;
  },
  get srcNode(): TextNode | undefined {
    const { expr } = this;
    if (expr?.isLinear()) return buildTextNodes(expr);
    return undefined;
  },
  selectionPos: [] as SrcMapItem[],
  setSelectionPos(posList: SrcMapItem[]) {
    this.selectionPos = posList;
  },
  clearSelectionPos() {
    this.setSelectionPos([]);
  },

  sectionsVisibility: {
    RichHtml: true,
    MathML: true,
    TeX: true,
    Text: true,
  } as Record<SectionKey, boolean>,

  toggleVisibility(section: SectionKey) {
    this.sectionsVisibility[section] = !this.sectionsVisibility[section];
    storageSave(visibilityKey, this.sectionsVisibility);
  },

  init() {
    const cvt = (json: unknown) =>
      json && typeof json === "object"
        ? (json as typeof this.sectionsVisibility)
        : undefined;
    const savedVisibility = storageLoad(visibilityKey, cvt);
    if (savedVisibility) {
      this.sectionsVisibility = savedVisibility;
    }
  },

  get formulaStyle(): CSSProperties {
    return {
      ...this.formulaViewSettings,
      // overflowX: "auto",
    };
  },

  // formula view
  formulaViewSettings: { ...defaultFormulaViewSettings } as FormulaViewSettings,
  setFormulaViewParam<P extends keyof FormulaViewSettings>(
    param: P,
    value: FormulaViewSettings[P]
  ) {
    this.formulaViewSettings[param] = value;
  },
  resetFormulaViewSettings() {
    this.formulaViewSettings = { ...defaultFormulaViewSettings };
  },

  // HTML format
  get richHtmlNodes(): XmlNode[] | undefined {
    const { srcNode } = this;
    if (!srcNode) return undefined;
    const options: OptionsHtmlRich = {
      idGen: idGenBase("id"),
    };
    return buildHtmlRich(srcNode, options)?.nodes;
  },
  get richHtmlCode(): string {
    const { richHtmlNodes } = this;
    return renderXmlNodes(richHtmlNodes, { indent: "  ", noSelfClosed: true });
  },

  // poor html
  get poorHtmlCode(): string {
    const { srcNode } = this;
    if (!srcNode) return "";
    return htmlPoor(srcNode, this.poorHtmlSettings);
  },
  poorHtmlSettings: { ...initialPoorHtmlSettings } as PoorHtmlSettings,
  setPoorHtmlSetting<Field extends keyof PoorHtmlSettings>(
    field: Field,
    value: PoorHtmlSettings[Field]
  ) {
    this.poorHtmlSettings[field] = value;
  },
  resetPoorHtmlSettings() {
    this.poorHtmlSettings = { ...initialPoorHtmlSettings };
  },

  // React view
  get reactData(): ResultHtmlRich | undefined {
    const { srcNode } = this;
    if (!srcNode) return undefined;
    const options: OptionsHtmlRich = {
      srcMap: true,
      idGen: () => `key${++reactKeyBase}`,
    };
    return buildHtmlRich(srcNode, options);
  },

  // TeX format
  teXSettings: { ...initialTeXSettings } as TeXOptions,
  setTeXSettings<Field extends keyof TeXOptions>(
    field: Field,
    value: TeXOptions[Field]
  ) {
    this.teXSettings[field] = value;
  },
  resetTeXSettings() {
    this.teXSettings = { ...initialTeXSettings };
  },
  get teXFormat(): string {
    if (!this.srcNode) return "";
    return buildTeX(this.srcNode, this.teXSettings);
  },

  // Text format
  textSettings: { ...initialTextSettings } as TextSettings,
  setTextSettings<Field extends keyof TextSettings>(
    field: Field,
    value: TextSettings[Field]
  ) {
    this.textSettings[field] = value;
  },
  resetTextSettings() {
    this.textSettings = { ...initialTextSettings };
  },
  get textFormat(): string {
    const { srcNode, textSettings } = this;
    if (!srcNode) return "";
    return buildTextFormat(srcNode, makeTextOptions(textSettings));
  },

  // CharChem format
  get charChemCode(): string {
    const { srcNode } = this;
    return srcNode ? buildCharChemText(srcNode) : "";
  },
  // get charChemExpr(): ChemExpr {
  //   return compile(this.charChemCode);
  // },

  onTextNode(node: TextNode | undefined): boolean {
    const nodeObj = getNodeObject(node);
    const srcMap = this.expr?.srcMap;
    if (nodeObj && srcMap) {
      const list = srcMap.filter(({ obj }) => nodeObj === obj);
      if (list.length > 0) {
        this.setSelectionPos(list);
        return true;
      }
    }
    this.clearSelectionPos();
    return false;
  },
});

let reactKeyBase = 0;

const getNodeObject = (node: TextNode | undefined): ChemObj | undefined => {
  if (!node) return undefined;
  switch (node.type) {
    case "item":
      return node.item;
    default:
      break;
  }
  return undefined;
};
