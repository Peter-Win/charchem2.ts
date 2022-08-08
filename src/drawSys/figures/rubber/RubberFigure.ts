import { PathSeg } from "../../path";
import { Rect } from "../../../math/Rect";
import { ChemImgProps } from "../../ChemImgProps";

export interface RubberFigure {
  draw(desiredRect: Rect, imgProps: ChemImgProps): PathSeg[];
}
