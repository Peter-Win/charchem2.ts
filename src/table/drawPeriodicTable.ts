import { Lang } from "../lang/Lang";
import { PeriodicTable } from "../core/PeriodicTable";
import { ifDef } from "../utils/ifDef";
import { CellRender } from "./CellRender";
import { Category, TableConfigItemExt, TableRules, TCell } from "./TableRules";
import { tableRulesStd } from "./TableRulesStd";
import { drawTag } from "../utils/xml/drawTag";

export const drawPeriodicTable = (rules: TableRules = tableRulesStd) => {
  const {
    tables,
    category,
    categoryExt = [],
    points,
    notes,
    cellFields,
  } = rules;
  const { cellRender = new CellRender(cellFields) } = rules;
  const cells: TCell[][][] = [];
  // Заготовка структкры
  const actualTables: TableConfigItemExt[] = tables.map((srcItem, n) => {
    const { NCol, NRow, ofsX = 0, ofsY = 0 } = srcItem;
    const { width = NCol, height = NRow } = srcItem;
    const tdef: TableConfigItemExt = {
      ...srcItem,
      width,
      height,
      ofsX,
      ofsY,
      w1: width,
      h1: height,
      x1: ofsX,
      y1: ofsY,
    };
    if (n === 0) {
      const { groupRows = 1, periodCols = 1 } = tdef;
      if (rules.flGroups) {
        tdef.y1 += groupRows;
        tdef.h1 += groupRows;
      }
      if (rules.flPeriods) {
        tdef.x1 += periodCols;
        tdef.w1 += periodCols;
      }
    }
    const row: TCell[][] = [];
    for (let j = 0; j < tdef.h1; j++) {
      row[j] = new Array<TCell>(tdef.w1);
    }
    cells[n] = row;
    return tdef;
  });
  if (rules.pre) rules.pre({ cells, actualTables, rules });

  // Развернуть свойства
  const categories: Category[] = [
    ...(category ? [category] : []),
    ...categoryExt,
  ];
  const grpMaps = categories.map((curCat) => {
    const catDict: Record<string, string> = {};
    Object.entries(curCat).forEach(([catName, catValues]) => {
      const list = Array.isArray(catValues) ? catValues : catValues.split(",");
      list.forEach((catValue) => {
        catDict[catValue] = catName;
      });
    });
    return catDict;
  });

  // набор текущих значений для каждой группы свойств из списка grpMaps
  let t = 0;
  let tdef = actualTables[t]!;
  let j = tdef.y1;
  let i = tdef.x1;
  const Ga = new Array(grpMaps.length);

  PeriodicTable.elements.forEach((elem) => {
    const { id } = elem;
    ifDef(points[id], (pos) => {
      t = pos[2] ?? 0;
      tdef = actualTables[t]!;
      i = pos[0] + tdef.x1;
      j = pos[1] + tdef.y1;
    });
    let cls = "chem-element";
    // перебираем все элементы grpMaps и достаём свойства, если они назначены на элемент
    grpMaps.forEach((G, gm) => {
      // очередная группа свойств
      ifDef(G[id], (grp) => {
        Ga[gm] = grp;
      });
      cls += ` ${Ga.join(" ")}`;
    });
    cells[t]![j]![i] = { elem, cls };
    if (++i === tdef.x1 + tdef.NCol) {
      i = tdef.x1;
      j++;
    }
  });

  // Номера групп
  if (rules.flGroups) {
    if (rules.drawGroups) rules.drawGroups({ cells, actualTables, rules });
    else
      for (i = 0; i < tdef.NCol; i++)
        cells[0]![tdef.y1 - 1]![tdef.x1 + i] = { text: String(i + 1) };
  }

  // Расставить номера периодов
  tdef = actualTables[0]!;
  if (rules.flPeriods) {
    const { drawPeriods } = rules;
    if (drawPeriods) {
      drawPeriods({ cells, actualTables, rules });
    } else {
      for (i = 0; i < tdef.NRow; i++)
        cells[0]![tdef.y1 + i]![tdef.x1 - 1] = {
          text: String(i + 1),
          cls: "period-id",
        };
    }
  }

  if (rules.post) rules.post({ cells, actualTables, rules });

  // Подписи к лантаноидам и актиноидам
  const LanActMap: Record<string, string> = {
    La: `57-71<br>${Lang.tr("Lanthanides")}`,
    Ac: `89-103<br>${Lang.tr("Actinides")}`,
  };
  if (rules.flLanAct && notes) {
    tdef = actualTables[0]!;
    Object.entries(notes).forEach(([id, pos]) => {
      cells[0]![pos[1] + tdef.y1]![pos[0] + tdef.x1] = {
        text: LanActMap[id],
        cls: "chem-cell mentable-text",
      };
    });
  }
  // Безусловные подписи
  ifDef(rules.hardNotes, (list) =>
    list.forEach(({ text, x, y, tblN = 0, cls }) => {
      const curTable = actualTables[tblN]!;
      cells[tblN]![y + curTable.y1]![x + curTable.x1] = { text, cls };
    })
  );

  // Финальный рендер
  let s = "";
  cells.forEach((curTable, n) => {
    s +=
      ifDef(rules.beginTable, (beginTable) => beginTable(n, rules)) ??
      drawTag("table", { class: rules.tableCls || "mentable" });
    curTable.forEach((row) => {
      s += "<tr>";
      for (const c of row) {
        if (!c) {
          s += "<td></td>";
        } else if (c.colspan !== 0) {
          s += `<td class="${c.cls || "chem-element"}"`;
          if (c.colspan) s += ` colspan="${c.colspan}"`;
          if (c.rowspan) s += ` rowspan="${c.rowspan}"`;
          s += ">";
          if (c.elem) {
            if (rules.elementBoxCls) {
              s += drawTag("div", { class: rules.elementBoxCls });
            }
            s += cellRender.draw(c.elem);
            if (rules.elementBoxCls) {
              s += "</div>";
            }
          } else if (c.text) s += c.text;
          s += "</td>";
        }
      }
      s += "</tr>";
    });
    s += "</table>";
  });
  return s;
};
