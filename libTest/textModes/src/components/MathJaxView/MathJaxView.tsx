import * as React from "react";
import { SafeBox } from "../ui/SafeBox";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { ViewInnerHtml } from "../ui/ViewInnerHtml";

type InputTeX = {
  type: "tex";
}
type InputMathML = {
  type: "mml";
}
type MathJaxInput = InputTeX | InputMathML;

type PropsMathJaxView = {
  code: string;
  input: MathJaxInput;
}

const texConfig = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["$$", "$$"]],
  },
} as const;

const mmlConfig = {
  loader: { load: ["input/mml", "output/chtml"] },
  mml: {}
} as const;

export const MathJaxView: React.FC<PropsMathJaxView> = (props) => {
  const { code, input } = props;
  const mmlDiv = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (input.type === "mml" && mmlDiv.current) {
      console.log(">>>", code);
      mmlDiv.current.innerHTML = code;
    }
  }, [code]);
  return (
    <SafeBox>
      {input.type === "tex" && <MathJaxContext 
        version={3}
        config={texConfig}
      >
        <MathJax inline dynamic>
          <ViewInnerHtml html={`\\(${code}\\)`} />
        </MathJax>
      </MathJaxContext>}
      {input.type === "mml" && <MathJaxContext 
        version={3} 
        config={mmlConfig}
      >
        <MathJax dynamic>
          <div ref={mmlDiv} />
        </MathJax>
      </MathJaxContext>}
    </SafeBox>
  );
}
