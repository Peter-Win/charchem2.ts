import * as React from "react";
import * as styles from "./Button.module.css";

interface PropsButton {
  htmlType?: "button" | "reset" | "submit";
  type?: "primary" | "normal";
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  form?: string;
}

export const Button: React.FC<PropsButton> = ({
  htmlType,
  type = "normal",
  children,
  disabled,
  onClick,
  form,
}: PropsButton) => (
  <button
    className={`${styles.button} ${styles[type]}`}
    type={htmlType ?? "button"}
    disabled={disabled}
    onClick={onClick}
    form={form}
  >
    {children}
  </button>
);
