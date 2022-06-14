import { fontWeightValue } from "../fontWeightValue";

it("fontWeightValue", () => {
  expect(fontWeightValue("100")).toBe(100);
  expect(fontWeightValue("400")).toBe(400);
  expect(fontWeightValue("900")).toBe(900);
  expect(fontWeightValue("bold")).toBe(700);
  expect(fontWeightValue("normal")).toBe(400);
});
