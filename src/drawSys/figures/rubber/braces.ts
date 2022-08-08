import { PathSeg, PathSegPt } from "../../path";
import { Rect } from "../../../math/Rect";
import { RubberFigure } from "./RubberFigure";
import { SrcData } from "./scalePath";
import { Point } from "../../../math/Point";
import { tracePath } from "../../utils/tracePath";

export const openBrace: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    return drawTriple(desiredRect, leftTop, leftMid, leftBottom, 3, 11);
  },
};

export const closeBrace: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    return drawTriple(desiredRect, rightTop, rightMid, rightBottom, 11, 3);
  },
};

// Данный алгоритм дает более качественное изображение, чем scalePath для символов {}
// Но его можно еще улучшить, если сделать резиновые точки соединения,
// а сами фигуры оставлять пропорциональными по высоте и ширине.
const drawTriple = (
  desiredRect: Rect,
  top: SrcData,
  mid: SrcData,
  bot: SrcData,
  topConn: number,
  botConn: number
): PathSeg[] => {
  const segs: PathSeg[] = [];
  // Проверка стыковки
  const topCa: Point = (top.segs[0] as PathSegPt).pt; // 210, 2545 | 769, 2545
  const topCb: Point = (top.segs[top.segs.length - 2] as PathSegPt).pt; // 0, 2545 | 559, 2545
  if (topCa.y !== topCb.y) return segs;
  const midCa: Point = (mid.segs[topConn] as PathSegPt).pt; // 637, 0 | 0, 4687
  const midCb: Point = (mid.segs[topConn + 1] as PathSegPt).pt; // 427, 0 | 210, 4687
  if (midCa.y !== midCb.y) return segs;
  const midCc: Point = (mid.segs[botConn] as PathSegPt).pt; // (427, 4687) | 210, 0
  // const midCd: Point = (mid.segs[botConn + 1] as PathSegPt).pt; // (637, 4687) | (0, 0)
  const botCc: Point = (bot.segs[0] as PathSegPt).pt; // 0, 0 | 769, 2545
  // const botCd: Point = (bot.segs[bot.segs.length - 2] as PathSegPt).pt; // 210, 0 | 559, 2545

  const rect = new Rect();
  const build = (src: PathSeg[], start: number, stop: number, delta: Point) => {
    const cvt = (p: Point): Point => {
      const res = p.plus(delta);
      if (res.isZero()) {
        rect.A.setPt(res);
        rect.B.setPt(res);
      } else {
        rect.A.mini(res);
        rect.B.maxi(res);
      }
      return res;
    };
    const step = 1; // ccw ? -1 : 1;
    let i = start;
    while (i !== stop) {
      if (i < 0) i = src.length - 1;
      else if (i === src.length) i = 0;
      const cur = src[i]!;
      i += step;
      switch (cur.cmd) {
        case "M":
          segs.push({ cmd: segs.length === 0 ? "M" : "L", pt: cvt(cur.pt) });
          break;
        case "L":
          segs.push({ cmd: "L", pt: cvt(cur.pt) });
          break;
        case "Q":
          segs.push({ cmd: "Q", pt: cvt(cur.pt), cp: cvt(cur.cp) });
          break;
        case "C":
          segs.push({
            cmd: "C",
            pt: cvt(cur.pt),
            cp1: cvt(cur.cp1),
            cp2: cvt(cur.cp2),
          });
          break;
        default:
          break;
      }
    }
  };
  build(top.segs, 0, top.segs.length - 1, new Point(midCa.x - topCa.x, 0));
  build(mid.segs, topConn + 1, botConn, new Point(0, top.height));
  build(
    bot.segs,
    0,
    bot.segs.length - 1,
    new Point(midCc.x - botCc.x, top.height + mid.height)
  );
  build(mid.segs, botConn + 1, topConn, new Point(0, top.height));
  // scale
  const kx = desiredRect.width / rect.width;
  const ky = desiredRect.height / rect.height;
  const scale = (pt: Point) => {
    pt.set((pt.x - rect.left) * kx, pt.y * ky);
  };
  tracePath(segs, {
    onM(p) {
      scale(p);
    },
    onL(p) {
      scale(p);
    },
    onC(p, cp1, cp2) {
      scale(p);
      scale(cp1);
      scale(cp2);
    },
    onQ(cp, p) {
      scale(cp);
      scale(p);
    },
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });

  segs.push({ cmd: "Z" });

  return segs;
};

// #7-0 -connect with middle
const leftBottom: SrcData = {
  width: 769,
  height: 2545,
  segs: [
    { cmd: "M", pt: new Point(0, 0) },
    { cmd: "L", pt: new Point(0, 801) },
    { cmd: "Q", pt: new Point(177.5, 2052.5), cp: new Point(0, 1632) },
    { cmd: "Q", pt: new Point(769, 2545), cp: new Point(355, 2473) },
    { cmd: "L", pt: new Point(769, 2450) },
    { cmd: "Q", pt: new Point(343, 1986), cp: new Point(476, 2381) },
    { cmd: "Q", pt: new Point(210, 767), cp: new Point(210, 1591) },
    { cmd: "L", pt: new Point(210, 0) },
    { cmd: "Z" },
  ],
};

// #3,4 - connect with top
// #11,12 - connect with bottom
const leftMid: SrcData = {
  width: 637,
  height: 4687,
  segs: [
    { cmd: "M", pt: new Point(209, 2331) },
    { cmd: "Q", pt: new Point(485.5, 2020), cp: new Point(350, 2271) },
    { cmd: "Q", pt: new Point(637, 1185), cp: new Point(621, 1769) },
    { cmd: "L", pt: new Point(637, 0) }, // 3
    { cmd: "L", pt: new Point(427, 0) }, // 4
    { cmd: "L", pt: new Point(427, 1359) },
    { cmd: "Q", pt: new Point(315, 2041), cp: new Point(427, 1811) },
    { cmd: "Q", pt: new Point(0, 2279), cp: new Point(203, 2271) },
    { cmd: "L", pt: new Point(0, 2399) },
    { cmd: "Q", pt: new Point(313, 2638), cp: new Point(199, 2407) },
    { cmd: "Q", pt: new Point(427, 3328), cp: new Point(427, 2869) },
    { cmd: "L", pt: new Point(427, 4687) }, // 11
    { cmd: "L", pt: new Point(637, 4687) }, // 12
    { cmd: "L", pt: new Point(637, 3502) },
    { cmd: "Q", pt: new Point(494.5, 2680), cp: new Point(637, 2945) },
    { cmd: "Q", pt: new Point(209, 2356), cp: new Point(352, 2415) },
    { cmd: "Z" },
  ],
};

// #7-0 -connect with middle
const leftTop: SrcData = {
  width: 769,
  height: 2545,
  segs: [
    { cmd: "M", pt: new Point(210, 2545) },
    { cmd: "L", pt: new Point(210, 1778) },
    { cmd: "Q", pt: new Point(343, 559), cp: new Point(210, 954) },
    { cmd: "Q", pt: new Point(769, 95), cp: new Point(476, 164) },
    { cmd: "L", pt: new Point(769, 0) },
    { cmd: "Q", pt: new Point(177.5, 492.5), cp: new Point(355, 72) },
    { cmd: "Q", pt: new Point(0, 1744), cp: new Point(0, 913) },
    { cmd: "L", pt: new Point(0, 2545) },
    { cmd: "Z" },
  ],
};

const rightBottom: SrcData = {
  width: 769,
  height: 2545,
  segs: [
    { cmd: "M", pt: new Point(559, 0) },
    { cmd: "L", pt: new Point(559, 767) },
    { cmd: "Q", pt: new Point(426, 1986), cp: new Point(559, 1591) },
    { cmd: "Q", pt: new Point(0, 2450), cp: new Point(293, 2381) },
    { cmd: "L", pt: new Point(0, 2545) },
    { cmd: "Q", pt: new Point(591.5, 2052.5), cp: new Point(414, 2473) },
    { cmd: "Q", pt: new Point(769, 801), cp: new Point(769, 1632) },
    { cmd: "L", pt: new Point(769, 0) },
    { cmd: "Z" },
  ],
};

const rightMid: SrcData = {
  width: 637,
  height: 4687,
  segs: [
    { cmd: "M", pt: new Point(428, 2356) },
    { cmd: "Q", pt: new Point(142.5, 2680), cp: new Point(285, 2415) },
    { cmd: "Q", pt: new Point(0, 3502), cp: new Point(0, 2945) },
    { cmd: "L", pt: new Point(0, 4687) }, // 3
    { cmd: "L", pt: new Point(210, 4687) }, // 4
    { cmd: "L", pt: new Point(210, 3328) },
    { cmd: "Q", pt: new Point(324, 2638), cp: new Point(210, 2869) },
    { cmd: "Q", pt: new Point(637, 2399), cp: new Point(438, 2407) },
    { cmd: "L", pt: new Point(637, 2279) },
    { cmd: "Q", pt: new Point(322, 2041), cp: new Point(434, 2271) },
    { cmd: "Q", pt: new Point(210, 1359), cp: new Point(210, 1811) },
    { cmd: "L", pt: new Point(210, 0) }, // 11
    { cmd: "L", pt: new Point(0, 0) }, // 12
    { cmd: "L", pt: new Point(0, 1185) },
    { cmd: "Q", pt: new Point(151.5, 2020), cp: new Point(16, 1769) },
    { cmd: "Q", pt: new Point(428, 2331), cp: new Point(287, 2271) },
    { cmd: "Z" },
  ],
};

const rightTop: SrcData = {
  width: 769,
  height: 2545,
  segs: [
    { cmd: "M", pt: new Point(769, 2545) },
    { cmd: "L", pt: new Point(769, 1744) },
    { cmd: "Q", pt: new Point(591.5, 492.5), cp: new Point(769, 913) },
    { cmd: "Q", pt: new Point(0, 0), cp: new Point(414, 72) },
    { cmd: "L", pt: new Point(0, 95) },
    { cmd: "Q", pt: new Point(426, 559), cp: new Point(293, 164) },
    { cmd: "Q", pt: new Point(559, 1778), cp: new Point(559, 954) },
    { cmd: "L", pt: new Point(559, 2545) },
    { cmd: "Z" },
  ],
};
