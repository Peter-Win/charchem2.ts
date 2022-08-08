import { ChemImgProps } from "../../ChemImgProps";
import { Rect } from "../../../math/Rect";
import { PathStyle } from "../../AbstractSurface";
import { FigPath } from "../FigPath";
import { Figure } from "../Figure";
import { RubberFigure } from "./RubberFigure";

/**
 * реализация интерфейса RubberFigure может поменяться. Её следует воспринимать как чёрный ящик.
 * На вход подается желаемый размер.
 * Фактический размер следует брать из фигуры (поле bounds)
 */
export const drawRubberFigure = (
  rubberFig: RubberFigure,
  desiredRect: Rect,
  style: PathStyle,
  imgProps: ChemImgProps
): Figure => {
  const fig = new FigPath(rubberFig.draw(desiredRect, imgProps), style);
  fig.update();
  return fig;
};
