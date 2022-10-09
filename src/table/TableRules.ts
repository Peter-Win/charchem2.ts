import { ChemAtom } from "../core/ChemAtom";
import { CellRender, CellRenderField, FieldRenderFn } from "./CellRender";

export type TCell = {
  cls?: string;
  elem?: ChemAtom;
  text?: string;
  colspan?: number; // Если ===0, то ячейка пропускается (используется в сочетании с colspan>1 других ячеек)
  rowspan?: number;
};

export interface TableConfigItem {
  NCol: number;
  NRow: number;
  width?: number;
  height?: number;
  ofsX?: number;
  ofsY?: number;
  groupRows?: number;
  periodCols?: number;
}

export type Category = Record<string, string>;

export interface TableConfigItemExt
  extends Omit<TableConfigItem, "ofsX" | "ofsY" | "width" | "height"> {
  width: number;
  height: number;
  ofsX: number;
  ofsY: number;
  w1: number;
  h1: number;
  x1: number;
  y1: number;
}

export interface ParamsTableCallback {
  cells: TCell[][][];
  actualTables: TableConfigItemExt[];
  rules: TableRules;
}

export interface TableRules {
  flGroups?: boolean;
  flPeriods?: boolean;
  flLanAct?: boolean;
  tables: TableConfigItem[];
  category?: Category;
  categoryExt?: Category[];
  points: Record<string, [number, number, number?]>;
  notes?: Record<string, [number, number]>;
  drawPeriods?(params: ParamsTableCallback): void;
  drawGroups?(params: ParamsTableCallback): void;
  pre?(params: ParamsTableCallback): void;
  post?(params: ParamsTableCallback): void;
  beginTable?(tableNumber: number, rules: TableRules): string; // default value: '<table class="mentable">'
  groupIds?: string[];
  groupCls?: string;
  cellFields?: (CellRenderField | FieldRenderFn)[];
  cellRender?: CellRender;
}
