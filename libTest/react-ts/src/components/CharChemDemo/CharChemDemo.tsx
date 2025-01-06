import * as React from "react";
import { observer } from "mobx-react-lite";
import { Input } from "src/components/Input";
import { charChemDemoStore as store } from "./CharChemDemoStore";
import { Hints } from "./Hints";
import { FormulaError } from "./FormulaError";
import { ExpressionDemo } from "./ExpressionDemo";
import * as styles from "./CharChemDemo.module.css";

export const CharChemDemo: React.FC = observer(() => {
  const refInput = React.useRef<HTMLInputElement>(null);
  const focus = (): void => refInput.current?.focus();
  React.useEffect(focus, []);
  return (
    <div className={styles.demoBox}>
      <Input
        ref={refInput}
        value={store.srcFormula}
        onChange={(ev) => store.setSrcFormula(ev.currentTarget.value)}
      />
      <Hints
        onHint={(formula) => {
          store.setSrcFormula(formula);
          focus();
        }}
      />
      <FormulaError expression={store.expression} />
      <ExpressionDemo store={store} />
    </div>
  );
});
