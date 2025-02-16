import { replaceSpecialTeXSymbols } from "../replaceSpecialTeXSymbols";

test("replaceSpecialTeXSymbols", () => {
  expect(replaceSpecialTeXSymbols("A↑ + B↓ = Δ")).toBe(
    "A\\uparrow  + B\\downarrow  = \\Delta "
  );
});
