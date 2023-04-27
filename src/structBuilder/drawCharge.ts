import { ChemStyleId } from "../drawSys/ChemStyleId";
import { ChemCharge } from "../core/ChemCharge";
import { ChemImgProps, TextProps } from "../drawSys/ChemImgProps";
import { FigFrame } from "../drawSys/figures/FigFrame";
import { Rect } from "../math/Rect";
import { drawTextNear, moveNearFigure, NearTextType } from "./drawTextNear";
import { FigEllipse } from "../drawSys/figures/FigEllipse";
import { Point } from "../math/Point";
import { Figure } from "../drawSys/figures/Figure";
import { CoeffPosOrAngle } from "../types/CoeffPos";
import { FigPath } from "../drawSys/figures/FigPath";
import { PathSeg } from "../drawSys/path";

interface ParamsDrawCharge {
  charge: ChemCharge;
  frame: FigFrame;
  rect: Rect;
  imgProps: ChemImgProps;
  color?: string;
  styleId?: ChemStyleId;
  type?: NearTextType;
}

export const drawCharge = ({
  charge,
  frame,
  rect,
  imgProps,
  color,
  styleId = "nodeCharge",
  type,
}: ParamsDrawCharge) => {
  const style = imgProps.getStyleColored(styleId, color);
  const pos = charge.pos ?? "RT";
  const figTxt: Figure =
    charge.text === "+" || charge.text === "-"
      ? drawSpecialCharge({
          frame,
          rect,
          text: charge.text,
          isRound: charge.isRound,
          pos,
          style,
          imgProps,
          type,
        })
      : drawTextNear({
          frame,
          rcCore: rect,
          text: charge.text,
          imgProps,
          style,
          pos,
          type,
        });
  frame.updateFigure(figTxt);
};

interface ParamsDrawSpechialCharge {
  frame: FigFrame;
  rect: Rect;
  text: "+" | "-";
  isRound: boolean;
  pos: CoeffPosOrAngle;
  style: TextProps;
  imgProps: ChemImgProps;
  type: NearTextType;
}
const drawSpecialCharge = (params: ParamsDrawSpechialCharge): Figure => {
  const { frame, rect, text, isRound, pos, style, imgProps, type } = params;
  const ff = style.font.getFontFace();
  const lw = imgProps.lineWidth;
  const w = style.font.getTextWidth("+") * 0.9 - (text === "-" ? lw : 0);

  // Для пиксельных поверхностей лучше было бы использовать вывод линий, а не закрашенных многоугольников
  // Но пока этого не делаем. Считаем, что всё выводится в вектор.

  // Координаты фигуры должны соответствовать принципам вывода текста. Т.е. начало в левом нижнем углу.
  const maxX = w;
  const maxY = -ff.capHeight;
  const minY = 0; // -ff.descent;
  const cx = maxX / 2;
  const cy = (maxY + minY) / 2;
  const lw2 = lw / 2;
  const segs: PathSeg[] =
    text === "-"
      ? [
          { cmd: "M", pt: new Point(0, cy - lw2) },
          { cmd: "H", x: maxX },
          { cmd: "V", y: lw, rel: true },
          { cmd: "H", x: 0 },
          { cmd: "Z" },
        ]
      : [
          { cmd: "M", pt: new Point(0, cy - lw2) },
          { cmd: "H", x: cx - lw2 },
          { cmd: "V", y: cy - w / 2 },
          { cmd: "H", rel: true, x: lw },
          { cmd: "V", y: cy - lw2 },
          { cmd: "H", x: maxX },
          { cmd: "V", rel: true, y: lw },
          { cmd: "H", x: cx + lw2 },
          { cmd: "V", y: cy + w / 2 },
          { cmd: "H", rel: true, x: -lw },
          { cmd: "V", y: cy + lw2 },
          { cmd: "H", x: 0 },
          { cmd: "Z" },
        ];
  const fig = new FigFrame();
  const figCharge = new FigPath(segs, { fill: style.style.fill });
  figCharge.update();
  figCharge.bounds.unite(new Rect(0, maxY, maxX, minY));
  fig.addFigure(figCharge);

  if (isRound) {
    const bounds = new Rect(0, maxY, maxX, minY);
    const r = Math.max(bounds.width, bounds.height) * 0.5;
    const figR = new FigEllipse(bounds.center, new Point(r, r), {
      stroke: style.style.fill,
    });
    fig.addFigure(figR);
  }

  fig.update();
  const rcFig = fig.bounds.clone();
  rcFig.A.y = -ff.ascent;
  rcFig.B.y = -ff.descent;
  moveNearFigure(fig, rcFig, pos, rect, imgProps, type);

  frame.addFigure(fig);
  frame.update();
  return fig;
};
