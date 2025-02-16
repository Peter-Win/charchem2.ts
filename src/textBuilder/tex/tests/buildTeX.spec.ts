import { compile } from "../../../compiler/compile";
import { buildTextNodes } from "../../buildTextNodes";
import { buildTeX } from "../buildTeX";

const makeTeX = (code: string) => {
  const expr = compile(code);
  if (!expr.isOk()) return expr.getMessage();
  const node = buildTextNodes(expr);
  return buildTeX(node, { scripts: "optimal" });
};

// some test data from here: https://mhchem.github.io/MathJax-mhchem/

test("buildTeX", () => {
  expect(makeTeX(`Hg^2+ "I^-"--> HgI2 "I^-"--> [Hg(ii)I4]^2-`)).toBe(
    `\\ce{Hg^{2+} ->[I^-] HgI_2 ->[I^-] [\\overset{II}{Hg}I_4]^{2-}}`
  );
  expect(makeTeX("Y^99+")).toBe("\\ce{Y^{99+}}");
  expect(makeTeX("$nM(227)Th^+")).toBe("\\ce{^{227}_{90}Th^+}");
  expect(makeTeX("$nM(0,-1){n}^-")).toBe("\\ce{^0_{-1}n^-}");
  expect(makeTeX(`{A} "text above"-->"text below" {B}`)).toBe(
    "\\ce{A ->[text above][text below] B}"
  );
  expect(makeTeX("[{{({X}2)3}}2]^3+")).toBe("\\ce{[\\{(X_2)_3\\}_2]^{3+}}");
  expect(makeTeX("{A}-{B}={C}%{D}")).toBe("\\ce{A-B=C≡D}");
  expect(makeTeX("Al$color(brown)Br3")).toBe("\\ce{Al{\\color{brown}Br_3}}");
});
