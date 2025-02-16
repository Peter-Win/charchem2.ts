import * as React from "react";
import * as styles from "./RadioButtons.module.css";
import { classNames } from "../../../common/classNames";
import { Option, BaseValue } from "../Option";


type PropsRadioButtons<TValue extends BaseValue> = {
  value: TValue;
  onChange: (newValue: TValue) => void;
  options: Option<TValue>[];
}

export const RadioButtons = <TValue extends BaseValue>(props: PropsRadioButtons<TValue>): React.ReactNode => {
  const { value: curValue, onChange, options } = props;
  return (
    <div className={styles.box}>
      {options.map(({value, label}) => <button 
        key={value}
        className={classNames([[value === curValue, styles.active]])}
        onClick={() => onChange(value)}
      >
        {label}
      </button>)}
    </div>
  );
}