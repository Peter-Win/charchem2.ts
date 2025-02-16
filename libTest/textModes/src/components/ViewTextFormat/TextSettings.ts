import { OptionsTextFormat } from "../../../../../src/textBuilder/text/buildTextFormat";
import { toSuperscript } from "../../../../../src/utils/unicode/toSuperscript";
import { toSubscript } from "../../../../../src/utils/unicode/toSubscript";
import { Option } from "../ui/Option";

export type TextSettings = {
  operations: "ascii" | "dstText";
  opComments: "text" | "ignore" | "quoted";
  sup: "withHat" | "text" | "unicode";
  sub: "text" | "withUnderscore" | "unicode";
  oxidationState: "ignore" | "sup" | "RT*" | "*RB" | "RB*" | "*LB" | "LB*" | "*LT" | "LT*" | "unicode" | "{}";
  mul: string;
  scriptDivider: string;
}

export const initialTextSettings = {
  operations: "ascii",
  opComments: "text",
  sup: "withHat",
  sub: "text",
  oxidationState: "ignore",
  mul: "*",
  scriptDivider: "",
} satisfies TextSettings;

export const makeTextOptions = (settings: TextSettings): OptionsTextFormat => {
  const { sup, sub, oxidationState, mul, scriptDivider } = settings;
  const dstSup: OptionsTextFormat["sup"] = sup === "unicode" ? toSuperscript : sup;
  const dstSub: OptionsTextFormat["sub"] = sub === "unicode" ? toSubscript : sub;
  let dstOx: OptionsTextFormat["oxidationState"];
  switch (oxidationState) {
    case "unicode":
      dstOx = (center: string, oxst: string) => `${center}${toSuperscript(oxst)}`;
      break;
    case "{}":
      dstOx = (center: string, oxst: string) => `${center}{${oxst}}`;
      break;
    default:
      dstOx = oxidationState;
      break;
  }
  const res: OptionsTextFormat = {
    operations: settings.operations,
    opComments: settings.opComments,
    sup: dstSup,
    sub: dstSub,
    oxidationState: dstOx,
    mul,
    scriptDivider,
  };
  return res;
}

export const textOperations: Option<TextSettings["operations"]>[] = [
  { value: "ascii", label: "ASCII" },
  { value: "dstText", label: "Unicode"},
]

export const textOpComments: Option<TextSettings["opComments"]>[] = [
  { value: "text", label: "Text" },
  { value: "ignore", label: "Ignore" },
  { value: "quoted", label: "Quoted" },
]

export const textSup: Option<TextSettings["sup"]>[] = [
  { value: "withHat", label: "Hat" },
  { value: "text", label: "Text" },
  { value: "unicode", label: "Unicode" },
]

export const textSub: Option<TextSettings["sub"]>[] = [
  { value: "text", label: "Text" },
  { value: "withUnderscore", label: "Underscore" },
  { value: "unicode", label: "Unicode" },
]

export const textOxidationStates: Option<TextSettings["oxidationState"]>[] = ([
   "ignore", "sup", "RT*", "*RB", "RB*", "*LB", "LB*", "*LT", "LT*", "unicode", "{}"
] as const).map(value => ({value, label: value}));

export const textMul: Option<string>[] = [
  "*", "·", "•", "×", "✕"
].map((value) => ({value, label: value}));

export const textScriptDivider = [
  { value: "", label: "None" },
  { value: ",", label: "Comma" },
  { value: ";", label: "Semicolon"},
];