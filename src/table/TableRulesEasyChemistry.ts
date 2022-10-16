/**
 * Site: https://chemistry-easy.ru/
 *
 * In certain circles, this version of the table is the most correct.
 * Although it does not correspond to the form adopted by IUPAC.
 * Discussion:
 * https://vk.com/topic-93343283_35170908
 * Images:
 * https://drive.google.com/drive/folders/1H8VT9UcX0UsWWIIiXh5O19C_FryArFYC
 */

import { fallingNumbers } from "./fallingNumbers";
import { categoryBlockDLa } from "./tableCategories";
import { TableRules } from "./TableRules";

const rules: TableRules = {
  tables: [
    { NCol: 19, NRow: 7 }, // 18 + Short column for lanthanides and actinides placeholder.
    { NCol: 15, NRow: 2 },
  ],
  category: categoryBlockDLa,
  points: {
    He: [18, 0],
    B: [13, 1],
    Al: [13, 2],
    Ti: [4, 3],
    Zr: [4, 4],
    Ce: [1, 0, 1],
    Hf: [4, 5],
    Th: [1, 1, 1],
    Rf: [4, 6],
  },
  hardNotes: [
    { text: "*", x: 3, y: 5, cls: "chem-element f_block mtbl-note" },
    { text: "*<br>*", x: 3, y: 6, cls: "chem-element f2_block mtbl-note" },
    { text: "*", x: 0, y: 0, tblN: 1, cls: "chem-element f_block mtbl-note" },
    {
      text: "*<br>*",
      x: 0,
      y: 1,
      tblN: 1,
      cls: "chem-element f2_block mtbl-note",
    },
  ],
  drawGroups: fallingNumbers,
  groupIds: "1,2,3,,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18".split(","),
  groupCls: "group-id",
  tableCls: "mentable easy-chem-table",
  elementBoxCls: "element-box",
};

export const tableRulesEasyChemistry = Object.freeze(rules);
