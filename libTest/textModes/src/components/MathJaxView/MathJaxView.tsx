import * as React from "react";
import { SafeBox } from "../ui/SafeBox";
import { MathJax, MathJaxContext, MathJaxContextProps } from "better-react-mathjax";
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
  return (
    <SafeBox>      
      {input.type === "tex" && (
        <MathJaxShell config={texConfig} code={`\\(${code}\\)`} />
      )}
      {input.type === "mml" && (
        <MathJaxShell config={mmlConfig} code="" />
      )}
    </SafeBox>
  );
}

type PropsMathJaxShell = {
  code: string;
  config: MathJaxContextProps["config"];
}

type StMJLoading = {
  state: "loading";
}
type StMJReady = {
  state: "ready";
}
type StMJError = {
  state: "error";
  error: Error;
}
type StMJ = StMJLoading | StMJReady | StMJError;

const MathJaxShell: React.FC<PropsMathJaxShell> = ({code, config}) => {
  const [stMJ, setStMJ] = React.useState<StMJ>({state: "loading"});
  return (
    <SafeBox>
      <MathJaxContext 
        version={3} 
        config={config}
        onError={(error) => setStMJ({state: "error", error})}
        onLoad={() => setStMJ({state: "ready"})}
      >
        {stMJ.state === "loading" && <div>Loading...</div>}
        {stMJ.state === "error" && (
          <div>
            <h3>Error</h3>
            <div>{stMJ.error.message}</div>
          </div>
        )}
        {stMJ.state === "ready" && (
          <MathJax inline dynamic>
            <ViewInnerHtml html={code} />
          </MathJax>
        )}
      </MathJaxContext>
    </SafeBox>
  )
}
