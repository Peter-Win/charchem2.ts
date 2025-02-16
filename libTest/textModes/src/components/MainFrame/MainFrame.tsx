import * as React from "react";
import * as styles from "./MainFrame.module.css";
import { store } from "../../store";
import { FormulaInputBox } from "../FormulaInputBox";
import { FormulaDetails } from "../FormulaDetails";

export const MainFrame: React.FC = () => {
  React.useEffect(() => {
    store.init();
  }, []);
  return (
    <div className={styles.mainFrame}>
      <h1>CharChem text modes</h1>
      <div className={styles.formulaBox}>
        <FormulaInputBox />
      </div>
      <FormulaDetails />
    </div>
  );
};
