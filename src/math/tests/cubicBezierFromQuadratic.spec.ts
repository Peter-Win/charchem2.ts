import { Point } from "../Point";
import { cubicBezierFromQuadratic } from "../cubicBezierFromQuadratic";
import { bezierCubic, bezierQuadratic } from "../bezier";

describe("cubicBezierFromQuadratic", () => {
  it("use calculator", () => {
    // calculator: https://www3.nd.edu/~gconant/bezier/
    const src = [new Point(0, 0), new Point(3, 2), new Point(3, 0)] as const;
    const res = cubicBezierFromQuadratic(src);
    // test cubic curve
    expect(res[0].toString()).toBe("(0, 0)");
    expect(res[1].toString()).toBe("(2, 1.33)");
    expect(res[2].toString()).toBe("(3, 1.33)");
    expect(res[3].toString()).toBe("(3, 0)");
    // The original values should remain unchanged
    expect(src[0].toString()).toBe("(0, 0)");
    expect(src[1].toString()).toBe("(3, 2)");
    expect(src[2].toString()).toBe("(3, 0)");
  });
  it("trace", () => {
    const quad = [new Point(0, 0), new Point(3, 2), new Point(3, 0)] as const;
    const cub = cubicBezierFromQuadratic(quad);
    for (let t = 0; t <= 1; t += 0.125) {
      const qValue = bezierQuadratic(quad, t);
      const cValue = bezierCubic(cub, t);
      expect(cValue.equals(qValue)).toBe(true);
    }
  });
});
