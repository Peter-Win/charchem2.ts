import { parseCssClassBody } from "../parseCssClassBody";

test("parseCssClassBody", () => {
  expect(parseCssClassBody("")).toEqual({});
  expect(parseCssClassBody("color: red")).toEqual({
    color: "red",
  });
  expect(parseCssClassBody(" color: red; ")).toEqual({
    color: "red",
  });
  expect(parseCssClassBody("color: blue; font-weight: bold")).toEqual({
    color: "blue",
    "font-weight": "bold",
  });
});
