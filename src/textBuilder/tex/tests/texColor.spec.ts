import { getTexColor } from "../buildTeX";

test("getTexColor", () => {
  const ctx = { extOp: false };
  expect(getTexColor("#000", ctx)).toBe("#000");
  expect(getTexColor("#000", { ...ctx, colors: "predefined" })).toBe("black");
  expect(getTexColor("#000", { ...ctx, colors: "dvips" })).toBe("Black");
  expect(getTexColor("#98CC70", { ...ctx, colors: "dvips" })).toBe(
    "YellowGreen"
  );
  expect(getTexColor("#98CC71", { ...ctx, colors: "dvips" })).toBe(
    "YellowGreen"
  );
});
