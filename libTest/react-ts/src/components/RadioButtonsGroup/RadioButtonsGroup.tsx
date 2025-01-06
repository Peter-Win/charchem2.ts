import * as React from "react";
import * as styles from "./RadioButtonsGroup.module.css";

type BaseValue = number | string;

export type RadioButton = {
  label: React.ReactNode;
  tooltip?: string;
};

interface PropsRadioButtonsGroup<ValueType extends BaseValue> {
  value?: ValueType;
  onChange?(newValue: ValueType): void;
  buttons: Record<ValueType, RadioButton>;
}

export const RadioButtonsGroup = <ValueType extends BaseValue>(
  props: PropsRadioButtonsGroup<ValueType>,
): React.ReactElement => {
  const { value, onChange, buttons } = props;
  return (
    <div className={styles.buttons}>
      {Object.entries<RadioButton>(buttons).map(([key, { label, tooltip }]) => (
        <button
          type="button"
          key={key}
          title={tooltip}
          className={value === key ? styles.active : undefined}
          onClick={() => onChange?.(key as ValueType)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
