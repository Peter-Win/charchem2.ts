import * as React from "react";
import * as styles from "./FormulaInputBox.module.css";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { debounce, DebounceCounter } from "../../common/debounce";

const tips: [number, string, React.ReactNode][] = [
  [1, "K3[Fe(CN)6]", "Potassium ferricyanide"],
  [2, `3Ca + 2CeCl3 "550-650^oC"--> 2Ce + 3CaCl2`, <span>Ca + CeCl<sub>3</sub></span>],
  [3, "(N(-3)H4(+1))2S(+6)O4(-2)", "Oxidation states"],
  [4, "$color(brown)3Br2$color() + 2Al → 2Al$itemColor1(brown)Br3", "Equation with colors"],
  [5, "$nM(22)Na + {e}^- -> $nM(22)Ne + {[nu]}'e'", "Nuclear reaction"],
  [6, "CH3-(C=O)-C%N", "Bonds"],
  [7, "(Ca,Mg)'3.21'SiO4*'x'H2O", "Mineral"],
  [8, `{A} + {B} -> C --> C "T"--> C -->"B" C "B"-->"A" C <==> C "T"<==> C <==>"B" C "T"<==>"b" C <-- C "T"<-- C <--"B" C "T"<--"B"`, "Arrows"]
];

const inputCounter: DebounceCounter = {};

export const FormulaInputBox = observer(() => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  React.useEffect(() => {
    setValue(store.formula);
  }, [store.formula]);
  const onChange = (text: string) => {
    setValue(text);
    debounce(inputCounter, 500, () => {
      store.setFormula(text);
    })
  }
  const onTip = (code: string) => {
    store.setFormula(code);
    setTimeout(() => ref.current?.focus(), 1);
  }
  return (
    <div className={styles.box}>
      <input 
        ref={ref} 
        type="text" 
        value={value} 
        onChange={ev => onChange(ev.currentTarget.value)} 
      />
      <div className={styles.tips}>
        {tips.map(([key, code, name]) => (
          <button 
            key={key}
            onClick={() => onTip(code)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
});