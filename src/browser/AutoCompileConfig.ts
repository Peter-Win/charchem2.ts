import { WebFontCache } from "../drawSys/browser/WebFontCache";
import { RulesHtml } from "../textRules/rulesHtml";

export type DrawSysId = "svg" | "canvas";

export interface AutoCompileConfig {
  nonText?: boolean; // default: false. If true, then text format is not used
  drawSysId?: DrawSysId; // default: svg
  formulaSelector?: string; // default: .echem-formula
  fontPropsCache?: WebFontCache;
  rules?: RulesHtml;
}

export const DrawSysIds: Record<DrawSysId, boolean> = {
  svg: true,
  canvas: true,
};
