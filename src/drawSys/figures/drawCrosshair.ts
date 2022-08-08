import { Point } from "../../math/Point";
import { PathStyle } from "../AbstractSurface";
import { PathSeg } from "../path";
import { FigFrame } from "./FigFrame";
import { FigPath } from "./FigPath";

export const drawCrosshair = (
  frame: FigFrame,
  center: Point,
  radius: number,
  style: PathStyle
) => {
  const path: PathSeg[] = [
    { cmd: "M", pt: center.clone().add(-radius, 0) },
    { cmd: "H", rel: true, x: radius * 2 },
    { cmd: "M", pt: center.clone().add(0, -radius) },
    { cmd: "V", rel: true, y: radius * 2 },
  ];
  frame.addFigure(new FigPath(path, style));
};
