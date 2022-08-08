import { compile } from "../../compiler/compile";
import { buildExpression } from "../buildExpression";
import { createTestImgProps, createTestSurface, saveSurface } from "./testEnv";

const build = (formula: string, svSuffix?: string) => {
  const expr = compile(formula);
  if (expr.error) throw expr.error;
  const surface = createTestSurface();
  const imgProps = createTestImgProps(surface, 40);
  const res = buildExpression(expr, imgProps);
  if (svSuffix) saveSurface(`Expr-${svSuffix}`, res.frame, surface);
  return res;
};

describe("buildExpression", () => {
  it("Simple equation", () => {
    const { frame } = build("2H2 + O2 = 2H2O", "simple");
    expect(frame.figures.length).toBe(5);
  });
});
