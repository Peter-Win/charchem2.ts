import * as React from "react";
import { store } from "../../store";
import { observer } from "mobx-react-lite";
import { Feature, FeaturesList } from "../FeaturesList";
import { ViewInnerHtml } from "../ui/ViewInnerHtml";
import { ToolbarAndContent } from "../ui/ToolbarAndContent";
import { htmlPoorOpComms, htmlPoorOxiStates, htmlPoorTags, PoorHtmlSettings } from "./PoorHtmlSettings";
import { Option } from "../ui/Option";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";

const paramSelector = <T extends keyof PoorHtmlSettings>(id: T, label: React.ReactNode, options: Option<PoorHtmlSettings[T]>[]) => (
  <Label label={label}>
    <Select
      value={store.poorHtmlSettings[id]}
      onChange={v => store.setPoorHtmlSetting(id, v)}
      options={options}
    />
  </Label>
)

export const ViewPoorHtmlFormat: React.FC = observer(() => {
  const  { poorHtmlCode } = store;

  if (!poorHtmlCode) return null;
  
  const features: Feature[] = [
    {
      name: "Source code",
      render: <code>{poorHtmlCode}</code>,
    },
    {
      name: "HTML view",
      render: <div style={store.formulaStyle} className="echem-formula">
        <ViewInnerHtml html={poorHtmlCode} />
      </div>,
    },
  ];

  const tools: React.ReactNode = <>
    {paramSelector("tags", "Tags", htmlPoorTags)}
    {paramSelector("opComments", "Operations comments", htmlPoorOpComms)}
    {paramSelector("oxidationState", "Oxidation state", htmlPoorOxiStates)}
  </>;
  
  return (
    <ToolbarAndContent
      tools={tools}
      contentPadding={false}
    >
      <FeaturesList storageKey="featPoorHtml" list={features} />
    </ToolbarAndContent>
  )
});