import { Point } from "../../../math/Point";
import { Rect } from "../../../math/Rect";
import { PathSeg } from "../../path";
import { RubberFigure } from "./RubberFigure";
import { scalePath, SrcData } from "./scalePath";

const data: SrcData = {
  width: 559,
  height: 1870,
  segs: [
    { cmd: "M", pt: new Point(559, 0) },
    { cmd: "Q", pt: new Point(281.5, 51), cp: new Point(389, 0) },
    { cmd: "Q", pt: new Point(114, 206.5), cp: new Point(174, 102) },
    { cmd: "Q", pt: new Point(27, 478), cp: new Point(54, 311) },
    { cmd: "Q", pt: new Point(0, 931), cp: new Point(0, 645) },
    { cmd: "Q", pt: new Point(26.5, 1383.5), cp: new Point(0, 1215) },
    { cmd: "Q", pt: new Point(113, 1658), cp: new Point(53, 1552) },
    { cmd: "Q", pt: new Point(281, 1817), cp: new Point(173, 1764) },
    { cmd: "Q", pt: new Point(559, 1870), cp: new Point(389, 1870) },
    { cmd: "L", pt: new Point(559, 1788) },
    { cmd: "Q", pt: new Point(435, 1776), cp: new Point(489, 1788) },
    { cmd: "Q", pt: new Point(331, 1722), cp: new Point(374, 1762) },
    { cmd: "Q", pt: new Point(253, 1599), cp: new Point(283, 1678) },
    { cmd: "Q", pt: new Point(201, 1355), cp: new Point(218, 1507) },
    { cmd: "Q", pt: new Point(183, 939), cp: new Point(183, 1194) },
    { cmd: "Q", pt: new Point(198, 556.5), cp: new Point(183, 714) },
    { cmd: "Q", pt: new Point(248, 299), cp: new Point(213, 399) },
    { cmd: "Q", pt: new Point(318, 168), cp: new Point(276, 215) },
    { cmd: "Q", pt: new Point(406, 106), cp: new Point(355, 127) },
    { cmd: "Q", pt: new Point(559, 82), cp: new Point(465, 82) },
    { cmd: "Z" },
  ],
};

export const openBracket: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    return scalePath(desiredRect, data);
  },
};
