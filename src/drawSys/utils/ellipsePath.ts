import { Point } from "../../math/Point";
import { PathSeg } from "../path";

let k: number | undefined;

export const ellipsePath = (center: Point, radius: Point): PathSeg[] => {
  const { x: cx, y: cy } = center;
  const { x: rx, y: ry } = radius;
  k = k ?? (4 / 3) * Math.tan(Math.PI / 8);
  const lx = rx * k;
  const ly = ry * k;
  return [
    {
      cmd: "M",
      pt: new Point(cx, cy - ry),
    },
    {
      cmd: "C",
      cp1: new Point(cx + lx, cy - ry),
      cp2: new Point(cx + rx, cy - ly),
      pt: new Point(cx + rx, cy),
    },
    {
      cmd: "C",
      cp1: new Point(cx + rx, cy + ly),
      cp2: new Point(cx + lx, cy + ry),
      pt: new Point(cx, cy + ry),
    },
    {
      cmd: "C",
      cp1: new Point(cx - lx, cy + ry),
      cp2: new Point(cx - rx, cy + ly),
      pt: new Point(cx - rx, cy),
    },
    {
      cmd: "C",
      cp1: new Point(cx - rx, cy - ly),
      cp2: new Point(cx - lx, cy - ry),
      pt: new Point(cx, cy - ry),
    },
    { cmd: "Z" },
  ];
};
