import { Point } from "../../math/Point";
import { Rect } from "../../math/Rect";

export const clipLine = (rect: Rect, a: Point, b: Point): Point | undefined => {
  const result = a.clone();
  const { A, B } = rect;
  if (b.x > a.x) {
    // Отсечение по правой грани
    const { x } = B;
    if (a.x < x) {
      const y = ((x - a.x) * (b.y - a.y)) / (b.x - a.x) + a.y;
      if (A.y < y && y < B.y) {
        // требуется отсечение по правой грани
        result.set(x, y);
      }
    }
  } else {
    // Отсечение по левой грани
    const { x } = A;
    if (x < a.x) {
      const y = ((x - a.x) * (b.y - a.y)) / (b.x - a.x) + a.y;
      if (A.y < y && y < B.y) {
        // требуется отсечение по левой грани
        result.set(x, y);
      }
    }
  }

  // console.log("pb=", pb.toString());
  if (b.y > a.y) {
    // Проверка отсечения по нижней грани
    const { y } = B;
    if (a.y < y) {
      const x = ((y - a.y) * (b.x - a.x)) / (b.y - a.y) + a.x;
      if (A.x < x && x < B.x) {
        // Необходимо отсечение по нижней грани
        result.set(x, y);
      }
    }
  } else {
    // Проверка отсечения по верхней грани
    const { y } = A;
    if (y < a.y) {
      const x = ((y - a.y) * (b.x - a.x)) / (b.y - a.y) + a.x;
      if (A.x < x && x < B.x) {
        // Необходимо отсечение по нижней грани
        result.set(x, y);
      }
    }
  }
  return result;
};
