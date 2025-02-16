import * as React from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { Feature, FeaturesList } from "../FeaturesList";
import { XmlCodeView } from "../XmlCodeView";
import { ViewInnerHtml } from "../ui/ViewInnerHtml";
import { ReactView } from "../ReactView";
import { XmlNode } from "../../../../../src/textBuilder/xmlNode/XmlNode";

export const ViewRichHtmlFormat: React.FC = observer(() => {
  const  { richHtmlNodes, richHtmlCode } = store;

  if (!richHtmlNodes) return null;

  const rootNode: XmlNode = {
    tag: "span",
    attrs: {"class": "echem-formula"},
    content: richHtmlNodes,
  }
  
  const features: Feature[] = [
    {
      name: "Source code",
      render: <XmlCodeView node={rootNode} indent="  " noSelfClosed />,
    },
    {
      name: "Simple view",
      render: <div style={store.formulaStyle} className="echem-formula">
        <ViewInnerHtml html={richHtmlCode} />
      </div>,
    },
    {
      name: "React view",
      render: <ReactView />
    },
  ];
  
  return (
    <FeaturesList storageKey="featRichHtml" list={features} />
  )
});