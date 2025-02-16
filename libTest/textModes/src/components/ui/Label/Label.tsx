import * as React from "react";
import * as styles from "./Label.module.css";
import { classNames } from "../../../common/classNames";

type PropsLabel = {
  label: React.ReactNode;
  children: React.ReactNode;
  right?: boolean;
  vertical?: boolean;
}

export const Label: React.FC<PropsLabel> = (props) => {
  const {label, children, right, vertical} = props;
  return (
    <span className={classNames([
      styles.box, 
      [vertical, styles.vertical],
      [right, styles.right],
    ])}>
      {label}
      {children}
    </span>
  );
}