import { Point } from "../../math/Point";
import { PathSeg } from "../path";

export const parsePath = (d: string): PathSeg[] => {
  const error = () => {
    throw Error("Invalid path");
  };
  const segments: PathSeg[] = [];
  const chunks = d
    .split(/([MLHVCSQTAZ\s,])/i)
    .filter((c) => !/^[,\s]*$/.test(c));
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
  while (pos < chunks.length) {
    const chunk = chunks[pos++]!;
    const rel = chunk >= "a" && chunk <= "z";
    const cmd = chunk.toUpperCase();
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
    } else error();
  }
  return segments;
};
