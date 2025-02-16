import * as React from "react";
import { Option, BaseValue } from "../Option";
import * as styles from "./Select.module.css";

type PropsSelect<TValue extends BaseValue> = {
  value: TValue;
  onChange: (newValue: TValue) => void;
  options: Option<TValue>[];
}

export const Select = <TValue extends BaseValue>( 
  { value: curValue, options, onChange }: PropsSelect<TValue>
) => (
  <div className={styles.select}>
    <select
      onChange={(e) => onChange(e.currentTarget.value as TValue)}
      value={curValue}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

