import { TeXOptions } from "charchem2/textBuilder/tex/buildTeX";
import { Option } from "../ui/Option";

export const initialTeXSettings: TeXOptions = {
  scripts: "optimal",
  colors: "original",
  noMhchem: false,
  comments: "CharChem",
};

export const texScripts: Option<TeXOptions["scripts"]>[] = [
  { value: "optimal", label: "Optimal" },
  { value: "braces", label: "Braces always" },
];

export const texColors: Option<TeXOptions["colors"]>[] = [
  { value: "original", label: "Original" },
  { value: "predefined", label: "Predefined colors" },
  { value: "dvips", label: "68 standard colors" },
];

export const texComments: Option<TeXOptions["comments"]>[] = [
  { value: "CharChem", label: "CharChem" },
  { value: "TeX", label: "TeX" },
];
