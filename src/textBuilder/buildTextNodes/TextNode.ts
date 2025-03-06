import { ChemAtom } from "../../core/ChemAtom";
import { ChemBond } from "../../core/ChemBond";
import { ChemCharge } from "../../core/ChemCharge";
import { ChemComment } from "../../core/ChemComment";
import { ChemCustom } from "../../core/ChemCustom";
import { ChemK } from "../../core/ChemK";
import { ChemNodeItem } from "../../core/ChemNodeItem";
import { ChemOp } from "../../core/ChemOp";
import { ChemRadical } from "../../core/ChemRadical";

export type TextPosition = "T" | "LT" | "RT" | "B" | "LB" | "RB" | "C";
export type SpaceType = "agentAgent" | "agentOp" | "opOp";
export type GroupType = "expr" | "agent" | "node";
export type CoeffType =
  | "agent"
  | "mul"
  | "item"
  | "bracket"
  | "mass"
  | "atomNum";

type TextCommonProps = {
  color?: string;
  items?: TextNode[];
  pos?: TextPosition;
  ltr?: boolean;
};

type TextAtom = {
  type: "atom";
  atom: ChemAtom;
};
type TextBond = {
  type: "bond";
  bond: ChemBond;
};
type TextBracket = {
  type: "bracket";
  text: string;
  begin: boolean;
};
type TextBrackets = {
  type: "brackets";
};
type TextCharge = {
  type: "charge";
  charge: ChemCharge;
};
type TextColumn = {
  type: "column";
  columnType: "op";
};
type TextComma = { type: "comma" };
type TextComment = { type: "comment"; comment: ChemComment };
type TextCustom = {
  type: "custom";
  custom: ChemCustom;
};
type TextGroup = {
  type: "group";
  groupType?: GroupType;
};
type TextItem = {
  type: "item";
  item: ChemNodeItem;
};
type TextK = {
  type: "k";
  k: ChemK;
  kType: CoeffType;
};
type TextMul = {
  type: "mul";
};
type TextOp = {
  type: "op";
  op: ChemOp;
};
type TextRadical = {
  type: "radical";
  radical: ChemRadical;
};
type TextRichText = {
  type: "richText";
  src?: string;
};
type TextSpace = {
  type: "space";
  spaceType?: SpaceType;
};
type TextString = {
  type: "text";
  text: string;
};

type TextUnion =
  | TextAtom
  | TextCharge
  | TextColumn
  | TextComma
  | TextComment
  | TextCustom
  | TextBond
  | TextBracket
  | TextBrackets
  | TextGroup
  | TextItem
  | TextK
  | TextMul
  | TextOp
  | TextRadical
  | TextRichText
  | TextSpace
  | TextString;

export type TextNode = TextUnion & TextCommonProps;
