/**
 * KaTeX library with mhchem extension
 * See documentation https://katex.org/docs/api
 */
import * as React from "react";
import * as styles from "./ViewKaTeX.module.css";
import katex, { KatexOptions } from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem";

type PropsViewKaTeX = {
  texCode: string;
}

export const ViewKaTeX: React.FC<PropsViewKaTeX> = ({texCode}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  type OutputMode = KatexOptions["output"];
  const [output, setOutput] = React.useState<OutputMode>("html");
  React.useEffect(() => {
    if (ref.current) {
      try {
        katex.render(texCode, ref.current, {output});
      } catch (e) {
        if (ref.current) ref.current.innerHTML = e.message;
      }
    }
  }, [texCode, output]);
  return (
    <div className={styles.box}>
      <div className={styles.toolbar}>
        <span>Output mode:</span>
        <button className={output === "html" ? styles.active : ""} onClick={() => setOutput("html")}>HTML</button>
        <button className={output === "mathml" ? styles.active : ""} onClick={() => setOutput("mathml")}>MathML</button>
      </div>
      <div ref={ref}></div>
    </div>
  )
}