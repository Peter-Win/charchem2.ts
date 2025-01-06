import * as React from "react";
import { ChemExpr } from "charchem2/core/ChemExpr";
import { ChemAgent } from "charchem2/core/ChemAgent";
import { ChemSys } from "charchem2/ChemSys";
import {
  AutoCompileConfig,
  DrawSysId,
} from "charchem2/browser/AutoCompileConfig";
import "charchem2/charchem.css"; // Global CharChem styles

export type ChemFormulaMode = "auto" | "canvas" | "nonText" | "svg";

interface PropsChemFormula extends React.HTMLProps<HTMLDivElement> {
  code: ChemAgent | ChemExpr | string;
  mode?: ChemFormulaMode;
}

const graphConfig = (drawSysId?: DrawSysId): AutoCompileConfig => ({
  nonText: true,
  drawSysId,
});

const configMap: Record<ChemFormulaMode, AutoCompileConfig> = {
  auto: {},
  nonText: graphConfig(),
  svg: graphConfig("svg"),
  canvas: graphConfig("canvas"),
};

export const ChemFormula: React.FC<PropsChemFormula> = (props) => {
  const { code, mode = "auto", ...divProps } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("echem-formula");
      ChemSys.draw(ref.current, code, configMap[mode]);
    }
  }, [
    code,
    mode,
    ref.current,
    divProps.className,
    JSON.stringify(divProps.style),
  ]);
  return <div ref={ref} {...divProps} />;
};
