import * as React from "react";
import { observer } from "mobx-react-lite";
import { store } from "../store";
import { ChemSys } from "../../../../src/ChemSys";
import { ToolbarAndContent } from "./ui/ToolbarAndContent";
import { FormulaViewSettings } from "./FormulaViewSettings";
import { Button } from "./ui/Button";
import { SafeBox } from "./ui/SafeBox";

const strParam = <P extends keyof FormulaViewSettings>(
  param: P,
  label: React.ReactNode,
) => (
  <label>
    <span>{label}: </span>
    <input 
      type="text" 
      value={store.formulaViewSettings[param]}
      onChange={e => store.setFormulaViewParam(param, e.currentTarget.value)}
    />
  </label>
);

const onDark = () => {
  store.setFormulaViewParam("color", "white");
  store.setFormulaViewParam("background", "black");
}
const onLight = () => {
  store.setFormulaViewParam("color", "black");
  store.setFormulaViewParam("background", "white");
}

export const FormulaView: React.FC = observer(() => {
  const fref = React.useRef<HTMLDivElement>(null);
  const { expr } = store;
  React.useEffect(() => {
    if (fref.current && expr) {
      ChemSys.draw(fref.current, expr, {drawSysId: "svg", nonText: true});
    }
  }, [expr, JSON.stringify(store.formulaViewSettings)]);
  const tools = <>
    {strParam("color", "Color")}
    {strParam("background", "Background")}
    {strParam("fontSize", "Font size")}
    <Button onClick={onDark}>Dark</Button>
    <Button onClick={onLight}>Light</Button>
    <span style={{flex: 1}} />
    <Button onClick={() => store.resetFormulaViewSettings()}>Reset</Button>
  </>;
  return (
    <ToolbarAndContent tools={tools}>
      <SafeBox>
        <div className="echem-formula" ref={fref} style={store.formulaStyle}></div>
      </SafeBox>
    </ToolbarAndContent>
  )
})