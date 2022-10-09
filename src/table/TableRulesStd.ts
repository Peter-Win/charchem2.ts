import { fallingNumbers } from "./fallingNumbers";
import { categoryProps } from "./tableCategories";
import { TableRules } from "./TableRules";

const rules: TableRules = {
  tables: [
    { NCol: 18, NRow: 7 },
    { NCol: 15, NRow: 2 },
  ],
  category: categoryProps,
  points: {
    He: [17, 0],
    B: [12, 1],
    Al: [12, 2],
    La: [0, 0, 1],
    Hf: [3, 5],
    Ac: [0, 1, 1],
    Rf: [3, 6],
  },
  notes: { La: [2, 5], Ac: [2, 6] },
  drawGroups: fallingNumbers,
  groupIds: [
    "1A",
    "2A",
    "3B",
    "4B",
    "5B",
    "6B",
    "7B",
    "┌──",
    "─8B─",
    "──┐",
    "1B",
    "2B",
    "3A",
    "4A",
    "5A",
    "6A",
    "7A",
    "8A",
  ],
  groupCls: "group-id",
};

export const tableRulesStd = Object.freeze(rules);
