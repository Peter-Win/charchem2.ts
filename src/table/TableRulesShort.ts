/*
 * Короткая форма таблицы отменена ИЮПАК в 1989 году.
 * Из современной иностранной литературы короткая форма исключена полностью,
 * вместо неё используется длинная форма, (Std)
 * однако, благодаря своей привычности и распространённости, она все ещё периодически встречается в российских справочниках и пособиях
 * https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%B0%D1%8F_%D1%84%D0%BE%D1%80%D0%BC%D0%B0_%D0%BF%D0%B5%D1%80%D0%B8%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B_%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2
 */
/* eslint-disable no-param-reassign */

import { Lang } from "../lang/Lang";
import { categoryBlock, subGroup } from "./tableCategories";
import { TableRules, TCell } from "./TableRules";

export const tableRulesShort: TableRules = {
  tables: [
    { NCol: 11, NRow: 11, periodCols: 2, groupRows: 2 },
    { NCol: 15, NRow: 2 },
  ],
  points: {
    H: [0, 0],
    He: [10, 0],
    Ne: [10, 1],
    Ar: [10, 2],
    Cu: [0, 4],
    Kr: [10, 4],
    Ag: [0, 6],
    Xe: [10, 6],
    La: [0, 0, 1],
    Hf: [3, 7],
    Au: [0, 8],
    Rn: [10, 8],
    Ac: [0, 1, 1],
    Rf: [3, 9],
    Rg: [0, 10],
  },
  flLanAct: true,
  notes: { La: [2, 7], Ac: [2, 9] },

  category: categoryBlock,
  categoryExt: [subGroup],
  groupIds:
    "I:a;b,II:a;b,III:a;b,IV:a;b,V:a;b,VI:a;b,VII:a;b,::R,VIII:b:LR,::LR,:a:L".split(
      ","
    ),
  groupCls: "chem-cell",

  drawGroups({ cells, actualTables, rules }) {
    const tdef = actualTables[0]!;
    const t0 = cells[0]!;

    for (let i = 0; i < tdef.NCol; i++) {
      const v = rules.groupIds![i]!.split(":");
      const p = {
        cls: rules.groupCls,
        rowspan: 2,
        text: `${v[0]}<div class="mentable-subgroup-hd">`,
      };
      if (v.length > 1) {
        const w = v[1]!.split(";");
        if (w.length === 2)
          p.text += `<span class="left">${w[0]}</span><span class="right">${w[1]}</span>`;
        else p.text += w[0];
      }
      if (v.length > 2) {
        if (v[2]!.indexOf("L") >= 0) p.cls += " noleft";
        if (v[2]!.indexOf("R") >= 0) p.cls += " noright";
      }

      p.text += "</div>";
      t0[tdef.y1 - 2]![i + tdef.x1] = p;
      t0[tdef.y1 - 1]![i + tdef.x1] = { colspan: 0 };
    }
  },

  drawPeriods({ cells, actualTables }) {
    // var i,p,
    let n = 1;
    const tdef = actualTables[0]!;
    const t0 = cells[0]!;
    for (let i = 0; i < tdef.NRow; i++) {
      const p: TCell =
        // eslint-disable-next-line no-bitwise
        i < 3 || i & 1
          ? { text: String(n++), cls: "period-id" }
          : { colspan: 0 };
      if (p && i >= 3) p.rowspan = 2;
      t0[tdef.y1 + i]![tdef.x1 - 2] = p;
    }
    for (let i = 0; i < tdef.NRow; i++)
      t0[tdef.y1 + i]![tdef.x1 - 1] = { text: String(i + 1), cls: "period-id" };
  },
  post({ cells }) {
    if (this.flGroups && this.flPeriods) {
      cells[0]![0]![0] = {
        text: `${Lang.tr("Group")}→`,
        cls: "mentable-text period-id",
        colspan: 2,
      };
      cells[0]![0]![1] = { colspan: 0 };
      cells[0]![1]![0] = {
        text: Lang.tr("Period"),
        cls: "mentable-text period-id",
      };
      cells[0]![1]![1]! = {
        text: Lang.tr("Row"),
        cls: "mentable-text period-id",
      };
    }
  },
  pre({ cells, actualTables }) {
    // Разметка. Колонки 0-6,10 имеют границы со всех сторон, 7,8,9-только сверху и снизу
    //  var a,i,
    // row,
    const t0 = cells[0]!;
    const tdef = actualTables[0]!;
    for (let j = 0; j < tdef.NRow; j++) {
      const row = t0[j + tdef.y1]!;
      for (let i = 0; i < tdef.NCol; i++) {
        row[i + tdef.x1] =
          i > 6 && i < 10 ? { cls: "chem-row" } : { cls: "chem-cell" };
      }
    }
  },
};
