import { scanMarkupEnd } from "../scanMarkupEnd";

test("scanMarkupEnd", () => {
  expect(scanMarkupEnd("", 0, "}")).toBe(0);
  expect(scanMarkupEnd("{}...", 1, "}")).toBe(2);
  //                    0 123456789012
  expect(scanMarkupEnd("{\\color{red}}...", 1, "}")).toBe(13);
  //                    012345678901
  expect(scanMarkupEnd("{x^{A_{21}}}...", 1, "}")).toBe(12);
});
