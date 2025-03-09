import * as React from "react";
import * as styles from "./ViewMathML.module.css";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { XmlNode } from "charchem2/textBuilder/xmlNode/XmlNode";
import { buildMathML } from "charchem2/textBuilder/mathml/buildMathML"
import { renderXmlNode } from "charchem2/textBuilder/xmlNode/renderXmlNode";
import { XmlCodeView } from "../XmlCodeView";
import { Checkbox } from "../ui/Checkbox";
import { Feature, FeaturesList } from "../FeaturesList";
import { ViewInnerHtml } from "../ui/ViewInnerHtml";
import { MathJaxView } from "../MathJaxView";

export const ViewMathMLFormat: React.FC = observer(() => {
  const { srcNode } = store;
  const [isNamespace, setIsNamespace] = React.useState(true);
  const [indent, setIndent] = React.useState("  ");
  const dstNode: XmlNode | undefined = React.useMemo(() => {
    return srcNode ? buildMathML(srcNode, {namespace: isNamespace}) : undefined;
  }, [srcNode, isNamespace]);
  const xmlCode: string = React.useMemo(() => dstNode ? renderXmlNode(dstNode) : "", [dstNode]);
  if (!dstNode) return null;
  const features: Feature[] = [
    {
      name: "Source code",
      render: () => <XmlCodeView node={dstNode} indent={indent} />
    },
    {
      name: "Embedding MathML",
      extra: <span className={styles.comment}>Not all browsers can display MathML correctly.</span>,
      render: () => <ViewInnerHtml html={xmlCode} className={styles.demo} />
    },
    {
      name: "MathJax",
      extra: <a href="https://docs.mathjax.org/en/latest/basic/mathjax.html" target="_blank">About MathJax</a>,
      render: <div className={styles.demo}>
        <MathJaxView code={xmlCode} input={{type: "mml"}} />
      </div>,
      visible: "always", // Если скрыть этот компонент, то внутри MathJax возникает ошибка. Её не перехватить через <SafeBox> потому что это необработанный промис.
    },
  ];
  return <div className={styles.box}>
    <div className={styles.toolbar}>
      <Checkbox checked={isNamespace} onChange={value => setIsNamespace(value)}>
        Namespace
      </Checkbox>
      <span>
        Indent:&nbsp;
        <select value={indent} onChange={e => setIndent(e.currentTarget.value)}>
          <option value="">None</option>
          <option value="  ">2 spaces</option>
          <option value="    ">4 spaces</option>
        </select>
      </span>
    </div>
    <FeaturesList storageKey="featMathML" list={features} />
  </div>
});