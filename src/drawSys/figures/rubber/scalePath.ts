import { Point } from "../../../math/Point";
import { Rect } from "../../../math/Rect";
import { tracePath } from "../../utils/tracePath";
import { PathSeg } from "../../path";

export interface SrcData {
  width: number;
  height: number;
  segs: PathSeg[];
}

export const scalePath = (desiredRect: Rect, data: SrcData): PathSeg[] => {
  const res: PathSeg[] = [];
  // p -- data
  // res -- desiredRect
  const cvt = (p: Point) =>
    new Point(
      (p.x * desiredRect.width) / data.width,
      (p.y * desiredRect.height) / data.height
    );
  tracePath(data.segs, {
    onM(p: Point): void {
      res.push({ cmd: "M", pt: cvt(p) });
    },
    onL(p: Point): void {
      res.push({ cmd: "L", pt: cvt(p) });
    },
    onC(cp1: Point, cp2: Point, p: Point): void {
      res.push({ cmd: "C", pt: cvt(p), cp1: cvt(cp1), cp2: cvt(cp2) });
    },
    onQ(cp: Point, p: Point): void {
      res.push({ cmd: "Q", pt: cvt(p), cp: cvt(cp) });
    },
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });
  return res;
};
