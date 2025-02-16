import * as React from "react";
import * as styles from "./Checkbox.module.css";

type PropsCheckbox = {
  name?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
}

export const Checkbox: React.FC<PropsCheckbox> = (props) => {
  const {name, checked, onChange, children} = props;
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        name={name}
        className={styles.input}
        onChange={(e) => {
          onChange(e.currentTarget.checked);
        }}
        checked={checked}
      />
      <div className={styles.pseudo} />
      {!!children && <div>{children}</div>}
    </label>
  );
}