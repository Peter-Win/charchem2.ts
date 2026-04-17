import { makeCssClassBody } from "../makeCssClassBody";

test("makeCssClassBody", () => {
  expect(
    makeCssClassBody({
      stroke: "blue",
      "stroke-width": "2px",
    })
  ).toBe("stroke: blue; stroke-width: 2px");
});
