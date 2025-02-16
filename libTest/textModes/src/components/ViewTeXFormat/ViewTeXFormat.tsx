import * as React from "react";
import * as styles from "./ViewTeXFormat.module.css";
import { TeXOptions } from "../../../../../src/textBuilder/tex/buildTeX";
import { Feature, FeaturesList } from "../FeaturesList";
import { ViewKaTeX } from "../ViewKaTeX/ViewKaTeX";
import { SafeBox } from "../ui/SafeBox";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { ToolbarAndContent } from "../ui/ToolbarAndContent";
import { Option } from "../ui/Option";
import { Select } from "../ui/Select";
import { texColors, texComments, texScripts } from "./TeXSettings";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { MathJaxView } from "../MathJaxView";

export const ViewTeXFormat: React.FC = observer(() => {
  const texCode = store.teXFormat;

  const [code, setCode] = React.useState("");
  React.useEffect(() => {setCode(texCode)}, [texCode]);

  const features: Feature[] = [
    {
        name: "Source code",
        render: (
          <textarea 
            value={code} 
            onChange={e => setCode(e.currentTarget.value)} 
            style={{width: "100%"}} 
          />
        ),
      },
    {
      name: "MathJax",
      extra: <a href="https://docs.mathjax.org/en/latest/basic/mathjax.html" target="_blank">About MathJax</a>,
      render: <div className={styles.demo}>
        <MathJaxView code={code} input={{type: "tex"}} />
      </div>,
    },
    {
      name: "KaTeX",
      extra: <a href="https://katex.org/" target="_blank">About KaTeX</a>,
      render: (
        <SafeBox>
          <div className={styles.demo}>
            <ViewKaTeX texCode={code} />
          </div>
        </SafeBox>
      )
    }
  ];
 
  const tools = <>
    {paramSelector("scripts", "Scripts", texScripts)}
    {paramSelector("colors", "Colors", texColors)}
    {paramSelector("comments", "Comments", texComments)}
    <Checkbox 
      checked={!!store.teXSettings.noMhchem} 
      onChange={v => store.setTeXSettings("noMhchem", v)}
    >Without Mhchem</Checkbox>
  </>
  
  return (
    <ToolbarAndContent tools={tools} contentPadding={false}>
      <FeaturesList storageKey="featTeX" list={features} />
    </ToolbarAndContent>
  )
});

type SelOptions = Omit<TeXOptions, "noMhchem">;
const paramSelector = <T extends keyof SelOptions>(id: T, label: React.ReactNode, options: Option<SelOptions[T]>[]) => (
  <Label label={`${label}:`}>
    <Select
      value={store.teXSettings[id]}
      onChange={v => store.setTeXSettings(id, v)}
      options={options}
    />
  </Label>
)
