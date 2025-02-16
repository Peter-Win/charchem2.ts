import { CSSProperties } from "react";
import { makeAutoObservable } from "mobx";
import { ChemExpr } from "../../../src/core/ChemExpr";
import { compile } from "../../../src/compiler/compile";
import { buildTextNodes, TextNode } from "../../../src/textBuilder/buildTextNodes";
import { buildTextFormat } from "../../../src/textBuilder/text/buildTextFormat";
import { initialTextSettings, makeTextOptions, TextSettings } from "./components/ViewTextFormat/TextSettings";
import { defaultFormulaViewSettings, FormulaViewSettings } from "./components/FormulaViewSettings";
import { buildHtmlRich, ResultHtmlRich } from "../../../src/textBuilder/htmlRich/buildHtmlRich";
import { OptionsHtmlRich } from "../../../src/textBuilder/htmlRich/OptionsHtmlRich";
import { ChemObj } from "../../../src/core/ChemObj";
import { SrcMapItem } from "../../../src/compiler/sourceMap";
import { XmlNode } from "../../../src/textBuilder/xmlNode/XmlNode";
import { idGenBase } from "../../../src/textBuilder/htmlRich/idGenBase";
import { renderXmlNodes } from "../../../src/textBuilder/xmlNode/renderXmlNode";
import { buildTeX, TeXOptions } from "../../../src/textBuilder/tex/buildTeX";
import { initialTeXSettings } from "./components/ViewTeXFormat/TeXSettings";
import { storageLoad, storageSave } from "./common/storage";

export type SectionKey = "RichHtml" | "MathML" | "TeX" | "Text";
const visibilityKey = "sections";

export const store = makeAutoObservable({
  formula: "",
  setFormula(code: string) {
    this.formula = code;
  },
  get expr(): ChemExpr | undefined {
    if (!this.formula) return undefined;
    const e = compile(this.formula, {srcMap: true});
    return e;
  },
  get srcNode(): TextNode | undefined {
    const {expr} = this;
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
      (json && typeof json === "object") ? json as typeof this.sectionsVisibility : undefined;
    const savedVisibility = storageLoad(visibilityKey, cvt);
    if (savedVisibility) {
      this.sectionsVisibility = savedVisibility;
    }
  },

  get formulaStyle(): CSSProperties {
    return {
      ...this.formulaViewSettings,
      // overflowX: "auto",
    }
  },

  // formula view
  formulaViewSettings: {...defaultFormulaViewSettings} as FormulaViewSettings,
  setFormulaViewParam<P extends keyof FormulaViewSettings>(param: P, value: FormulaViewSettings[P]) {
    this.formulaViewSettings[param] = value;
  },
  resetFormulaViewSettings() {
    this.formulaViewSettings = {...defaultFormulaViewSettings};
  },

  // HTML format
  get richHtmlNodes(): XmlNode[] | undefined {
    const { srcNode } = this;
    if (!srcNode) return undefined;
    const options: OptionsHtmlRich = {
      idGen: idGenBase("id"),
    }
    return buildHtmlRich(srcNode, options)?.nodes;
  },
  get richHtmlCode(): string {
    const { richHtmlNodes } = this;
    return renderXmlNodes(richHtmlNodes, {indent: "  ", noSelfClosed: true});
  },

  // React view
  get reactData(): ResultHtmlRich | undefined {
    const {srcNode} = this;
    if (!srcNode) return undefined;
    const options: OptionsHtmlRich = {
      srcMap: true,
      idGen: () => `key${++reactKeyBase}`,
    };
    return buildHtmlRich(srcNode, options);
  },

  // TeX format
  teXSettings: {...initialTeXSettings} as TeXOptions,
  setTeXSettings<Field extends keyof TeXOptions>(field: Field, value: TeXOptions[Field]) {
    this.teXSettings[field] = value;
  },
  resetTeXSettings() {
    this.teXSettings = {...initialTeXSettings};
  },
  get teXFormat(): string {
    if (!this.srcNode) return "";
    return buildTeX(this.srcNode, this.teXSettings);
  },

  // Text format
  textSettings: {...initialTextSettings} as TextSettings,
  setTextSettings<Field extends keyof TextSettings>(field: Field, value: TextSettings[Field]) {
    this.textSettings[field] = value;
  },
  resetTextSettings() {
    this.textSettings = {...initialTextSettings};
  },
  get textFormat(): string {
    const {srcNode, textSettings} = this;
    if (!srcNode) return "";
    return buildTextFormat(srcNode, makeTextOptions(textSettings));
  },

  onTextNode(node: TextNode | undefined): boolean {
    const nodeObj = getNodeObject(node);
    const srcMap = this.expr?.srcMap;
    if (nodeObj && srcMap) {
      const list = srcMap.filter(({obj}) => nodeObj === obj);
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
}