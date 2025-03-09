import { Point } from "../../math/Point";
import { PathSeg } from "../path";

/**
 * @param d SVG > path > d attribute
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
 * @returns
 */
export const parsePath = (d: string): PathSeg[] => {
  const error = () => {
    throw Error("Invalid path");
  };
  const segments: PathSeg[] = [];
  const chunks = splitPathChunks(d);
  let pos = 0;
  const readNum = (): number => {
    const n = +(chunks[pos++] || NaN);
    if (Number.isNaN(n)) error();
    return n;
  };
  const readFlag = (flagName: string): 0 | 1 => {
    const n = readNum();
    if (n === 0 || n === 1) return n;
    throw Error(`Expected 0 or 1 for ${flagName}`);
  };
  let prevCmd = "";
  while (pos < chunks.length) {
    const chunk = chunks[pos++]!;
    let cmd = chunk;
    if (!Number.isNaN(+cmd)) {
      // Multiple pairs of coordinates detected
      // https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands
      // Но кроме того экспериментальным путём в процессе работы над стрелкой, заимствованной из мат. библиотеки,
      // выяснилось что команду для кривых "C" тоже можно повторять уже без буквы.
      cmd = nextImplicitCmd[prevCmd] ?? prevCmd;
      pos--;
    } else {
      prevCmd = cmd;
    }
    const rel = cmd >= "a" && cmd <= "z";
    cmd = cmd.toUpperCase();
    if (cmd === "Z") {
      segments.push({ cmd, rel });
    } else if (cmd === "H") {
      segments.push({ cmd, rel, x: readNum() });
    } else if (cmd === "V") {
      segments.push({ cmd, rel, y: readNum() });
    } else if (cmd === "M" || cmd === "L" || cmd === "T") {
      const x = readNum();
      const y = readNum();
      segments.push({ cmd, rel, pt: new Point(x, y) });
    } else if (cmd === "Q") {
      const x1 = readNum();
      const y1 = readNum();
      const x = readNum();
      const y = readNum();
      segments.push({ cmd, rel, cp: new Point(x1, y1), pt: new Point(x, y) });
    } else if (cmd === "C") {
      const x1 = readNum();
      const y1 = readNum();
      const x2 = readNum();
      const y2 = readNum();
      const x = readNum();
      const y = readNum();
      segments.push({
        cmd,
        rel,
        cp1: new Point(x1, y1),
        cp2: new Point(x2, y2),
        pt: new Point(x, y),
      });
    } else if (cmd === "S") {
      const x2 = readNum();
      const y2 = readNum();
      const x = readNum();
      const y = readNum();
      segments.push({ cmd, rel, cp2: new Point(x2, y2), pt: new Point(x, y) });
    } else if (cmd === "A") {
      const rx = readNum();
      const ry = readNum();
      const xRot = readNum();
      const largeArc = readFlag("large-arc-flag");
      const sweep = readFlag("sweep-flag");
      const x = readNum();
      const y = readNum();
      segments.push({
        cmd,
        rel,
        r: new Point(rx, ry),
        xRot,
        largeArc,
        sweep,
        pt: new Point(x, y),
      });
    } else {
      error();
    }
  }
  return segments;
};

const nextImplicitCmd: Record<string, string> = {
  M: "L",
  m: "l",
};

// TODO: Сначала казалось хорошей идеей использовать регэкспы. Но потом оказалось, что надо учитывать минусы и точки без пробелов.
// Парсинг стал слишком сложный. Поэтому есть смысл уже использовать посимвольное сканирование с конечным автоматом.

export const splitPathChunks = (d: string): string[] => {
  const res: string[] = d.split(/([MLHVCSQTAZ\s,-])/i);
  // Обработка минусов
  for (;;) {
    const minusPos = res.indexOf("-");
    if (minusPos < 0) break;
    res.splice(minusPos, 1); // delete single minus character
    if (res[minusPos]) {
      res[minusPos] = `-${res[minusPos]}`; // prepend minus to next chunk

      const prev = res[minusPos - 1];
      if (prev && /e$/i.test(prev)) {
        // if previous chunk is path of exponential number, then unite these chunks
        res[minusPos - 1] = `${prev}${res[minusPos]}`;
        res.splice(minusPos, 1);
      }
    }
  }
  // Разделение слившихся точек
  for (;;) {
    const pos = res.findIndex((chunk) => /\..*\./.test(chunk));
    if (pos < 0) break;
    const parts = res[pos]!.split(".");
    const firstNumber = parts.slice(0, 2).join(".");
    const rest = `.${parts.slice(2).join(".")}`;
    res[pos] = firstNumber;
    res.splice(pos + 1, 0, rest);
  }

  return res.filter((chunk) => !/^[,\s]*$/.test(chunk));
};
