export type HtmlRichClass =
  | "agent"
  | "agent-k"
  | "arrow-bidir"
  | "arrow-bkwd"
  | "arrow-both"
  | "arrow-both-left"
  | "arrow-both-right"
  | "arrow-fwd"
  | "charge"
  | "expr"
  | "has-over"
  | "minus"
  | "mul"
  | "node-item"
  | "op"
  | "op-arrow"
  | "op-both"
  | "op-code"
  | "op-comment"
  | "op-footer"
  | "op-head"
  | "over"
  | "supsub"
  | "supsub-left"
  | "symbols";

export const htmlRichCls = (clsCode: HtmlRichClass | HtmlRichClass[]): string =>
  (Array.isArray(clsCode) ? clsCode : [clsCode])
    .map((c) => `cch-${c}`)
    .join(" ");
