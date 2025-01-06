import * as React from "react";
import * as styles from "./Input.module.css";

interface PropsInput {
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  maxLength?: number;
}

export const Input = React.forwardRef(
  (
    { name, value, onChange, onBlur, maxLength }: PropsInput,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => (
    <div className={styles.input}>
      <input
        ref={ref}
        name={name}
        type="string"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
      />
    </div>
  ),
);
