import { ParamsTableCallback } from "./TableRules";

/**  Функция, выводящая номера из массива rules.groupIds над первой заполненной ячейкой
 */
export const fallingNumbers = ({
  cells,
  actualTables,
  rules,
}: ParamsTableCallback) => {
  const t0 = cells[0]!;
  const tdef = actualTables[0]!;
  const X: number[] = [];
  const Y: number[] = [];
  let y: number;

  for (let j = 0; j < tdef.NCol; j++) {
    const x = tdef.x1 + j;
    X.push(x);
    // опускаемся по столбцу до последней незаполненной ячейки. первая всегда незаполнена. для H и He она же последняя.
    y = tdef.y1;
    while (y < t0.length && !t0[y]![x]) y++;
    Y.push(y);
    if (y < t0.length) {
      t0[y - 1]![x] = { text: rules.groupIds?.[j] ?? "", cls: rules.groupCls };
    }
  }
  // Объединение ячеек 7,8,9
  y = Y[7]!;
  if (
    (rules.groupIds?.[8]?.indexOf("8B") ?? -1) >= 0 &&
    y < t0.length &&
    y === Y[8] &&
    Y[8] === Y[9]
  ) {
    const x = X[7] ?? 0;
    y--;
    t0[y]![x]!.text += t0[y]![x + 1]!.text! + t0[y]![x + 2]!.text!;
    t0[y]![x]!.colspan = 3;
    t0[y]![x + 1]!.colspan = 0;
    t0[y]![x + 2]!.colspan = 0;
  }
};
