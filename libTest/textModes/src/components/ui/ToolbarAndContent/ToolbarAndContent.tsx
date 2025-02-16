import * as React from "react";
import * as styles from "./ToolbarAndContent.module.css";
import { classNames } from "../../../common/classNames";

type PropsToolbarAndContent = {
  tools: React.ReactNode;
  children: React.ReactNode;
  contentPadding?: boolean;
}

export const ToolbarAndContent: React.FC<PropsToolbarAndContent> = (props) => {
  const {tools, children, contentPadding = true} = props;
  return (
    <div className={styles.box}>
      <div className={styles.toolbar}>{tools}</div>
      <div className={classNames([
        styles.content,
        [contentPadding, styles.contentPadding],
      ])}>{children}</div>
    </div>
  );
}