import { pathToString } from "../utils/pathToString";
import { FigFrame } from "./FigFrame";
import { FigPath } from "./FigPath";
import { FigText } from "./FigText";
import { Figure } from "./Figure";

const tab = (level: number): string => "  ".repeat(level);

export const debugFigureOut = (fig: Figure, level: number = 0): string => {
  let figType: string = "Unknown";
  let details = "";
  if (fig instanceof FigFrame) {
    figType = "Frame";
    details = fig.figures.map((f) => debugFigureOut(f, level + 1)).join("");
  } else if (fig instanceof FigText) {
    figType = "Text";
    details = `${tab(level + 1)}text="${fig.text}"\n`;
  } else if (fig instanceof FigPath) {
    figType = "Path";
    details = `${tab(level + 1)}path: ${pathToString(fig.segs)}\n`;
  }
  const res = `${tab(level)}${figType} org: ${fig.org}; bounds: ${
    fig.bounds
  }\n${details}`;
  return res;
};
