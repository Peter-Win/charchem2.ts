import { PathSeg } from "../../path";
import { Rect } from "../../../math/Rect";
import { Point } from "../../../math/Point";
import { RubberFigure } from "./RubberFigure";
import { scalePath, SrcData } from "./scalePath";

const data: SrcData = {
  width: 559,
  height: 1870,
  segs: [
    { cmd: "M", pt: new Point(0, 1870) },
    { cmd: "Q", pt: new Point(277.5, 1819), cp: new Point(170, 1870) },
    { cmd: "Q", pt: new Point(445, 1663.5), cp: new Point(385, 1768) },
    { cmd: "Q", pt: new Point(532, 1392), cp: new Point(505, 1559) },
    { cmd: "Q", pt: new Point(559, 939), cp: new Point(559, 1225) },
    { cmd: "Q", pt: new Point(532.5, 486.5), cp: new Point(559, 655) },
    { cmd: "Q", pt: new Point(446, 212), cp: new Point(506, 318) },
    { cmd: "Q", pt: new Point(278, 53), cp: new Point(386, 106) },
    { cmd: "Q", pt: new Point(0, 0), cp: new Point(170, 0) },
    { cmd: "L", pt: new Point(0, 82) },
    { cmd: "Q", pt: new Point(124, 94), cp: new Point(70, 82) },
    { cmd: "Q", pt: new Point(228, 148), cp: new Point(185, 108) },
    { cmd: "Q", pt: new Point(306, 271), cp: new Point(276, 192) },
    { cmd: "Q", pt: new Point(358, 515), cp: new Point(341, 363) },
    { cmd: "Q", pt: new Point(376, 931), cp: new Point(376, 676) },
    { cmd: "Q", pt: new Point(361, 1313.5), cp: new Point(376, 1156) },
    { cmd: "Q", pt: new Point(311, 1571), cp: new Point(346, 1471) },
    { cmd: "Q", pt: new Point(241, 1702), cp: new Point(283, 1655) },
    { cmd: "Q", pt: new Point(153, 1764), cp: new Point(204, 1743) },
    { cmd: "Q", pt: new Point(0, 1788), cp: new Point(94, 1788) },
    { cmd: "Z" },
  ],
};

export const closeBracket: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    return scalePath(desiredRect, data);
  },
};
