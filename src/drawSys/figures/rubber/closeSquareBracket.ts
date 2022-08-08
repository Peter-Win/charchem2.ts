import { ChemImgProps } from "../../ChemImgProps";
import { Rect } from "../../../math/Rect";
import { RubberFigure } from "./RubberFigure";
import { PathSeg } from "../../path";
import { Point } from "../../../math/Point";

export const closeSquareBracket: RubberFigure = {
  draw(desiredRect: Rect, imgProps: ChemImgProps): PathSeg[] {
    const lw = imgProps.lineWidth;
    const { A, B } = desiredRect;
    const segs: PathSeg[] = [
      { cmd: "M", pt: new Point() },
      { cmd: "H", x: B.x },
      { cmd: "V", y: B.y },
      { cmd: "H", x: A.x },
      { cmd: "V", y: B.y - lw },
      { cmd: "H", x: B.x - lw },
      { cmd: "V", y: A.y + lw },
      { cmd: "H", x: A.x },
      { cmd: "Z" },
    ];
    return segs;
  },
};
