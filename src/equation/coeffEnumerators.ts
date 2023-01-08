import { Int } from "../types";

/* eslint no-bitwise: "off" */

export const makeCoeffEnumerator = (
  dimesion: Int,
  level: Int
): Generator<Int[]> => {
  if (dimesion === 2) return coeffEnumerator2d(level);
  if (dimesion === 3) return coeffEnumerator3d(level);
  return coeffEnumeratorNd(dimesion, level);
};

export function* coeffEnumerator2d(level: Int) {
  for (let x0 = 1; x0 <= level; x0++) {
    for (let y = 1, x = x0; x > 0; y++, x--) {
      yield [y, x];
    }
  }
  for (let y0 = 2; y0 <= level; y0++) {
    for (let x = level, y = y0; y <= level; y++, x--) {
      yield [y, x];
    }
  }
}

export function* coeffEnumerator3d(level: Int): Generator<Int[]> {
  yield [1, 1, 1];
  // Перемещение по x
  for (let x0 = 2; x0 <= level; x0++) {
    let x = x0;
    let y = 1;
    let z = 1;
    // фронтальная плоскость XY
    for (; x > 1; x--, y++) yield [z, y, x];
    // левая плоскость YZ, x=1
    for (; y > 1; z++, y--) yield [z, y, x];
    // верхняя плоскость XZ
    for (; z > 1; z--, x++) yield [z, y, x];
  }
  // по Y
  const c = Math.floor((level - 2) / 2) + 2;
  for (let y0 = 2; y0 < level; y0++) {
    if (y0 === c) {
      for (const v of coeffEnumerator3d(level - 2)) {
        yield v.map((i) => i + 1);
      }
    }
    let x = level;
    let y = y0;
    let z = 1;
    for (; y < level; y++, x--) yield [z, y, x];
    for (; x > 1; z++, x--) yield [z, y, x];
    for (; z < level; z++, y--) yield [z, y, x];
    for (; y > 1; x++, y--) yield [z, y, x];
    for (; x < level; x++, z--) yield [z, y, x];
    for (; z > 1; z--, y++) yield [z, y, x];
  }
  // по Z
  for (let z0 = 1; z0 < level; z0++) {
    let x = level;
    let y = level;
    let z = z0;
    for (; z < level; x--, z++) yield [z, y, x];
    for (; x < level; x++, y--) yield [z, y, x];
    for (; y < level; z--, y++) yield [z, y, x];
  }

  if (level > 1) {
    yield [level, level, level];
  }
}

/**
 * Перебор выполняется только для высокоуровневых выриантов,
 * а вложенные части раскрываются при помощи перебора более низкого порядка
 * @param dimension
 * @param maxLevel
 */
export function* coeffEnumeratorNd(
  dimension: Int,
  maxLevel: Int
): Generator<Int[]> {
  const vars = new Array<Int>(dimension);
  vars.fill(1);
  yield [...vars];
  const maxMask = 1 << dimension;
  for (let level = 2; level <= maxLevel; level++) {
    // перебор верхнеуровневых вариантов
    for (let mask = 1; mask !== maxMask; mask++) {
      const subLevelNdx: Int[] = [];
      vars.fill(1);
      for (let col = 0; col < dimension; col++) {
        const test = 1 << col;
        if ((mask & test) === 0) {
          subLevelNdx.push(col);
        } else {
          vars[col] = level;
        }
      }
      const sn = subLevelNdx.length;
      if (level > 2 && sn > 0) {
        // Перебор вложенной части
        const gen = makeCoeffEnumerator(sn, level - 1);
        for (const subVals of gen) {
          subVals.forEach((v, j) => {
            vars[subLevelNdx[j]!] = v;
          });
          yield [...vars];
        }
      } else {
        yield [...vars];
      }
    }
  }
}
