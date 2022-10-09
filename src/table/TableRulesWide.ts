import { fallingNumbers } from "./fallingNumbers";
import { categoryProps } from "./tableCategories";
import { TableRules } from "./TableRules";

const rules: TableRules = {
  tables: [{ NCol: 32, NRow: 7, ofsX: 1, ofsY: 1, width: 33, height: 8 }],
  category: categoryProps,
  points: {
    H: [0, 0],
    He: [31, 0],
    B: [26, 1],
    Al: [26, 2],
    Sc: [16, 3],
    Y: [16, 4],
  },
  groupIds:
    "1A,2A,,,,,,,,,,,,,,,3B,4B,5B,6B,7B,┌──,8B,──┐,1B,2B,3A,4A,5A,6A,7A,8A".split(
      ","
    ),
  groupCls: "group-id",
  drawGroups: fallingNumbers,
};

export const tableRulesWide = Object.freeze(rules);
