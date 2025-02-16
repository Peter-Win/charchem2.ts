import { replaceGreek } from "../comment";

test("replaceGreek", () => {
  expect(replaceGreek("")).toBe("");
  expect(replaceGreek("A + [Delta]")).toBe("A + Δ");
  expect(replaceGreek("A + \\Delta")).toBe("A + Δ");
});
