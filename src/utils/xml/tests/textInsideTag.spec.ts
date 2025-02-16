import { textInsideTag } from "../textInsideTag";

test("textInsideTag", () => {
  expect(textInsideTag("")).toBe("");
  expect(textInsideTag(" ")).toBe("\u00A0");
  expect(textInsideTag("  ")).toBe("\u00A0");
  expect(textInsideTag("  ")).toBe("\u00A0");
  expect(textInsideTag(" W")).toBe("\u00A0W");
  expect(textInsideTag("  W")).toBe("\u00A0W");
  expect(textInsideTag("W ")).toBe("W\u00A0");
  expect(textInsideTag("W  ")).toBe("W\u00A0");
  expect(textInsideTag(" W ")).toBe("\u00A0W\u00A0");
  expect(textInsideTag("  W  ")).toBe("\u00A0W\u00A0");
  expect(textInsideTag(" W V ")).toBe("\u00A0W V\u00A0");
  expect(textInsideTag("  W  V  ")).toBe("\u00A0W V\u00A0");
});
