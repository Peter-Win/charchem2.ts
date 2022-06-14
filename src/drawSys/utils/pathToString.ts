import { PathSeg } from "../path";
import { Point } from "../../math/Point";
import { toa } from "../../math";

export const pathToString = (segments: PathSeg[]): string =>
  segments
    .map((seg) => {
      const { cmd } = seg;
      let dstSeg: string = seg.rel ? cmd.toLowerCase() : cmd;
      const addPoint = (p: Point) => {
        if (dstSeg.length !== 1) dstSeg += " ";
        dstSeg += `${toa(p.x)} ${toa(p.y)}`;
      };
      switch (cmd) {
        case "M":
        case "L":
        case "T":
          addPoint(seg.pt);
          break;
        case "H":
          dstSeg += toa(seg.x);
          break;
        case "V":
          dstSeg += toa(seg.y);
          break;
        case "C":
          addPoint(seg.cp1);
          addPoint(seg.cp2);
          addPoint(seg.pt);
          break;
        case "S":
          addPoint(seg.cp2);
          addPoint(seg.pt);
          break;
        case "Q":
          addPoint(seg.cp);
          addPoint(seg.pt);
          break;
        case "A":
          addPoint(seg.r);
          dstSeg += ` ${toa(seg.xRot)} ${seg.largeArc} ${seg.sweep}`;
          addPoint(seg.pt);
          break;
        default:
          break;
      }
      return dstSeg;
    })
    .join("");
