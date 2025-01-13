import { cssColor2ps } from "../color2ps";

test("cssColor2ps", () => {
  expect(cssColor2ps("black")).toBe("0 0 0 setrgbcolor");
  expect(cssColor2ps("white")).toBe("1 1 1 setrgbcolor");
  // 0x88/255 = 0.533 (3 gigits after dot)
  expect(cssColor2ps("#F80")).toBe("1 0.533 0 setrgbcolor");
  // 0x30/255 = 0.188
  expect(cssColor2ps("#303030")).toBe("0.188 0.188 0.188 setrgbcolor");

  expect(cssColor2ps(undefined)).toBe("");
  expect(cssColor2ps("")).toBe("");
});
