import * as React from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { ToolbarAndContent } from "../ui/ToolbarAndContent";
import { Select } from "../ui/Select";
import { textMul, textOpComments, textOperations, textOxidationStates, textScriptDivider, TextSettings, textSub, textSup } from "./TextSettings";
import { Option } from "../ui/Option";
import { Button } from "../ui/Button";

const paramSelector = <T extends keyof TextSettings>(id: T, label: React.ReactNode, options: Option<TextSettings[T]>[]) => (
  <label>
    <span style={{fontSize: "90%"}}>{label}</span> 
    <Select
      value={store.textSettings[id]}
      onChange={v => store.setTextSettings(id, v)}
      options={options}
    />
  </label>
)

const lbScriptDiv = <span 
  title="It is used when different values ​​are output in one position. E.g. mass and charge"
  >Script divider</span>;

export const ViewTextFormat: React.FC = observer(() => {
  const { textFormat } = store;
  const tools: React.ReactNode = <>
    {paramSelector("operations", "Operations", textOperations)}
    {paramSelector("opComments", "Op comments", textOpComments)}
    {paramSelector("sup", "Superscripts", textSup)}
    {paramSelector("sub", "Subscripts", textSub)}
    {paramSelector("oxidationState", "Oxidation state", textOxidationStates)}
    {paramSelector("mul", "Multiplication", textMul)}
    {paramSelector("scriptDivider", lbScriptDiv, textScriptDivider)}
    <span style={{flex: 1}} />
    <Button onClick={() => store.resetTextSettings()}>Reset</Button>
  </>;
  return (
    <ToolbarAndContent tools={tools}>
      <code>{textFormat}</code>
    </ToolbarAndContent>
  );
})