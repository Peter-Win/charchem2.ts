import * as React from "react";
import * as styles from "./FormatBox.module.css";
import { classNames } from "../../common/classNames";
import { SafeBox } from "../ui/SafeBox";

type PropsFormatBox = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  toggle: () => void;
}

export const FormatBox: React.FC<PropsFormatBox> = (props) => {
  const {title, children, open, toggle} = props;
  return (
    <SafeBox>
      <div className={classNames([styles.box, [open, styles.open]])}>
        <button className={styles.title} onClick={toggle}>
          {icon}
          <div>{title}</div>
        </button>
        {open && <div className={styles.content}>
          {children}
        </div>}
      </div>
    </SafeBox>
  )
} 

const icon = (
  <svg viewBox="64 64 896 896" focusable={false} data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
    <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
  </svg>
);
