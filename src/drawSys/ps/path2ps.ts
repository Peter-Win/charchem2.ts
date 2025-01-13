import { lastItem } from "../../utils/lastItem";
import { Point } from "../../math/Point";
import { PathSeg } from "../path";
import { tracePath } from "../utils/tracePath";
import { cubicBezierFromQuadratic } from "../../math/cubicBezierFromQuadratic";

type GrCmd = "moveto" | "lineto" | "curveto";

export const path2ps = (path: PathSeg[]): string[] => {
  const lines: string[] = [];
  let prevPt: Point | undefined;
  const addCmd = (points: Point[], cmd: GrCmd) => {
    prevPt = lastItem(points);
    const params = points.map((pt) => `${pt.x} ${pt.y}`).join(" ");
    return lines.push(`${params} ${cmd}`);
  };
  tracePath(path, {
    onA() {
      // TODO: Вообще в PS есть такие возможности, но пока до них руки не дошли.
      throw Error("Arc not supported for PostScript path");
    },
    onM: (p) => addCmd([p], "moveto"),
    onL: (p) => addCmd([p], "lineto"),
    onC: (cp1, cp2, pt) => addCmd([cp1, cp2, pt], "curveto"),
    onQ: (cp, p) =>
      addCmd(
        cubicBezierFromQuadratic([prevPt ?? Point.zero, cp, p]).slice(1),
        "curveto"
      ),
    onZ: () => lines.push("closepath"),
  });
  return lines;
};

// Теоретически, можно было бы сделать алгоритм с поддержкой rmoveto, rlineto, rcurveto.
// Для этого надо было бы вместо tracePath писать новый обработчик с учетом флага rel.
// Но так как в PS нет квадратных кривых, то приходится их пересчитывать в кубические.
// В результате алгоритм получается слишком сложный.
// А смысла в этом особо нет, т.к. и так всё работает.
