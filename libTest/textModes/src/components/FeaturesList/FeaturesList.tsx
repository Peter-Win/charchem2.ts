import * as React from "react";
import * as styles from "./FeaturesList.module.css";
import { Checkbox } from "../ui/Checkbox";
import { storageLoad, storageSave } from "../../common/storage";

export type Feature = {
  name: string;
  extra?: React.ReactNode;
  render: React.ReactNode | (() => React.ReactNode);
  visible?: "always"; 
}

type PropsFeaturesList = {
  storageKey: string;
  list: Feature[];
}

export const FeaturesList: React.FC<PropsFeaturesList> = (props) => {
  const {storageKey, list} = props;
  const [visibility, setVisibility] = React.useState(list.reduce(
    (acc, it) => ({...acc, [it.name]: true}),
    {} as Record<string, boolean>
  ))
  React.useEffect(() => {
    const cvt = (json: unknown) => 
      (!json || typeof json !== "object") ? undefined : json as Record<string, boolean>;
    
    const settings = storageLoad(storageKey, cvt);
    if (settings) {
      setVisibility(settings);
    }
  }, []);
  const toggle = (name: string) => {
    setVisibility(prev => {
      const next = {...prev, [name]: !prev[name]};
      storageSave(storageKey, next);
      return next;
    });
  }
  return (
    <div className={styles.list}>
      {list.map(({name, extra, render, visible}) => (
        <div key={name} className={visibility[name] ? styles.open : undefined}>
          <div className={styles.itemTopRow}>
            <div className={styles.itemHead}>
              {visible === "always" ? <span>{name}</span> : 
                <Checkbox checked={!!visibility[name]} onChange={() => toggle(name)}>{name}</Checkbox>
              }
            </div>
            {extra && !!visibility[name] && <div>{extra}</div>}
          </div>
          {(visible === "always" || !!visibility[name]) && <div className={styles.itemBody}>
            {typeof render === "function" ? render() : render}
          </div>}
        </div>
      ))}
    </div>
  )
}