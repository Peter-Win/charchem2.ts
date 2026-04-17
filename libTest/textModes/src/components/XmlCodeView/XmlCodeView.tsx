import * as React from "react";
import { XmlNode } from "charchem2/textBuilder/xmlNode/XmlNode";
import { renderXmlNode } from "charchem2/textBuilder/xmlNode/renderXmlNode";

type PropsXmlCodeView = {
  indent: string;
  noSelfClosed?: boolean;
  node: XmlNode | undefined;
}

export const XmlCodeView: React.FC<PropsXmlCodeView> = (props) => {
  const {node, indent, noSelfClosed} = props;
  const xmlCode: string = React.useMemo(
    () => node ? renderXmlNode(node, {indent, noSelfClosed}) : "", 
    [node, indent]
  );
  return <textarea style={{width: "100%"}} value={xmlCode} rows={5} readOnly />;
}
