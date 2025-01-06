import * as React from "react";
import { ChemExpr } from "charchem2/core/ChemExpr";
import { ChemError } from "charchem2/core/ChemError";
import * as styles from "./FormulaError.module.css";

interface PropsFormulaError {
  expression: ChemExpr | null;
}

type TChunk = {
  key: string;
  text: string;
  cls?: string;
};

export const FormulaError: React.FC<PropsFormulaError> = ({ expression }) => {
  if (!expression || expression.isOk()) return null;
  const { error } = expression;
  let chunks: TChunk[] = [];
  if (error instanceof ChemError) {
    const { pos, pos0 } = error.params ?? {};
    if (typeof pos === "number") {
      chunks[0] = {
        key: "0",
        text: expression.src,
      };
      chunks = splitChunks(chunks, pos - 1, styles.pos);
      if (typeof pos0 === "number") {
        chunks = splitChunks(chunks, pos0, styles.pos0);
      }
    }
  }
  return (
    <div className={styles.errorBox}>
      <div className={styles.message}>{expression.getMessage()}</div>
      {chunks.length > 0 && (
        <div>
          {chunks.map(({ key, text, cls }) => (
            <span key={key} className={cls}>
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const splitChunks = (src: TChunk[], pos: number, cls: string): TChunk[] => {
  const result: TChunk[] = [];
  let left = 0;
  src.forEach((chunk) => {
    const right = left + chunk.text.length;
    if (pos >= left && pos < right) {
      const offset = pos - left;
      if (offset > 0) {
        result.push({
          key: `${chunk.key}:left`,
          text: chunk.text.slice(0, offset),
        });
      }
      result.push({
        key: chunk.key,
        text: chunk.text.slice(offset, offset + 1),
        cls,
      });
      if (pos !== right - 1) {
        result.push({
          key: `${chunk.key}:right`,
          text: chunk.text.slice(offset + 1),
        });
      }
    } else {
      result.push(chunk);
    }
    left = right;
  });
  return result;
};
