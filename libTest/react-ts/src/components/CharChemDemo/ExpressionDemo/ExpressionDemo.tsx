import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  RadioButton,
  RadioButtonsGroup,
} from "src/components/RadioButtonsGroup";
import { ChemFormulaMode, ChemFormula } from "src/components/ChemFormula";
import {
  CharChemDemoStore,
  FormulaSize,
  FormulaTheme,
} from "../CharChemDemoStore";
import * as styles from "./ExpressionDemo.module.css";

interface PropsExpressionDemo {
  store: CharChemDemoStore;
}

const viewModes: Record<ChemFormulaMode, RadioButton> = {
  auto: {
    label: "Auto",
    tooltip: "Use default settings to output the formula",
  },
  nonText: { label: "Non-text", tooltip: "Do not use text mode" },
  svg: { label: "SVG", tooltip: "Use vector graphics to output the formula" },
  canvas: {
    label: "Canvas",
    tooltip: "Use raster graphics to output the formula",
  },
};

const themes: Record<FormulaTheme, RadioButton> = {
  light: { label: "Light" },
  dark: { label: "Dark" },
};

const sizes: Record<FormulaSize, RadioButton> = {
  normal: { label: "Normal size" },
  double: { label: "x2" },
  quadruple: { label: "x4" },
};

const sizeValue: Record<FormulaSize, string> = {
  normal: "1rem",
  double: "2rem",
  quadruple: "4rem",
};

export const ExpressionDemo: React.FC<PropsExpressionDemo> = observer(
  ({ store }) => {
    const { expression, theme, size } = store;
    if (!expression || !expression.isOk) return null;
    return (
      <>
        <div className={styles.toolbar}>
          <RadioButtonsGroup
            buttons={viewModes}
            value={store.viewMode}
            onChange={(mode) => store.setViewMode(mode)}
          />
          <RadioButtonsGroup
            buttons={themes}
            value={theme}
            onChange={(newTheme) => store.setTheme(newTheme)}
          />
          <RadioButtonsGroup
            buttons={sizes}
            value={size}
            onChange={(newSize) => store.setSize(newSize)}
          />
        </div>
        <div className={styles.formulaBox}>
          <ChemFormula
            code={expression}
            mode={store.viewMode}
            className={styles[theme]}
            style={{ fontSize: sizeValue[size] }}
          />
        </div>
      </>
    );
  },
);
