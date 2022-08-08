import { Point } from "../../../math/Point";
import { Rect } from "../../../math/Rect";
import { PathSeg } from "../../path";
import { RubberFigure } from "./RubberFigure";

const width = 446;
const thickH = 82;
const thickV = 176;

export const openSquareBracket: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    const scale = desiredRect.width / width;
    const sWidth = width * scale;
    const sHeight = desiredRect.height;
    const sThickH = thickH * scale;
    const sThickV = thickV * scale;
    return [
      { cmd: "M", pt: new Point(sWidth, 0) },
      { cmd: "H", x: 0 },
      { cmd: "V", y: sHeight },
      { cmd: "H", x: sWidth },
      { cmd: "V", y: sHeight - sThickH },
      { cmd: "H", x: sThickV },
      { cmd: "V", y: sThickH },
      { cmd: "H", x: sWidth },
      { cmd: "Z" },
    ];
  },
};

export const closeSquareBracket: RubberFigure = {
  draw(desiredRect: Rect): PathSeg[] {
    const scale = desiredRect.width / width;
    const sWidth = width * scale;
    const sHeight = desiredRect.height;
    const sThickH = thickH * scale;
    const sThickV = thickV * scale;
    return [
      { cmd: "M", pt: new Point() },
      { cmd: "H", x: sWidth },
      { cmd: "V", y: sHeight },
      { cmd: "H", x: 0 },
      { cmd: "V", y: sHeight - sThickH },
      { cmd: "H", x: sWidth - sThickV },
      { cmd: "V", y: sThickH },
      { cmd: "H", x: 0 },
      { cmd: "Z" },
    ];
  },
};
