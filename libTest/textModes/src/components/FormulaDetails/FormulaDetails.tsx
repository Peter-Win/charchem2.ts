import * as React from "react";
import * as styles from "./FormulaDetails.module.css";
import { SectionKey, store } from "../../store";
import { FormatBox } from "../FormatBox/FormatBox";
import { ViewMathMLFormat } from "../ViewMathMLFormat/ViewMathMLFormat";
import { ViewTeXFormat } from "../ViewTeXFormat";
import { ViewRichHtmlFormat } from "../ViewRichHtmlFormat";
import { observer } from "mobx-react-lite";
import { ViewTextFormat } from "../ViewTextFormat";
import { FormulaView } from "../FormulaView";
import { ViewPoorHtmlFormat } from "../ViewPoorHtmlFormat";
import { ViewCharChemFormat } from "../ViewCharChemFormat";

type SectionDef = {
  Component: React.FC;
  title: string;
}

const sections: Partial<Record<SectionKey, SectionDef>> = {
  RichHtml: {
    Component: ViewRichHtmlFormat,
    title: "HTML",
  },
  MathML: {
    Component: ViewMathMLFormat,
    title: "MathML",
  },
  TeX: {
    Component: ViewTeXFormat,
    title: "TeX",
  },
  Text: {
    Component: ViewTextFormat,
    title: "Text",
  },
  PoorHtml: {
    Component: ViewPoorHtmlFormat,
    title: "Poor HTML",
  },
  CharChem: {
    Component: ViewCharChemFormat,
    title: "CharChem",
  },
}

export const FormulaDetails: React.FC = observer(() => {
  const { expr, srcNode, sectionsVisibility } = store;
  if (!expr) return null;
  if (!expr.isOk()) {
    return (
      <div className={styles.error}>{expr.getMessage()}</div>
    );
  }
  return (
    <div className={styles.box}>
      <FormulaView />
      {!srcNode && <div>This formula is not textual</div>}
      {!!srcNode && <>
        {(Object.keys(sections) as SectionKey[]).map(key => {
          const def = sections[key];
          if (!def) return null;
          const { Component, title } = def;
          return (
            <FormatBox 
              key={key} 
              title={title} 
              open={sectionsVisibility[key]}
              toggle={() => store.toggleVisibility(key)}
            >
              <Component />
            </FormatBox>
          );
        })}
      </>}
    </div>
  );
});
