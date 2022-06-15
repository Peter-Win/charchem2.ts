import { Lang } from "../Lang";

it("Lang", () => {
  const key = "Expected [must] instead of [have]";
  const params = { must: 1, have: 22, pos: 5 };
  Lang.curLang = "en";
  expect(Lang.tr(key, params)).toBe("Expected 1 instead of 22");
  Lang.curLang = "ru";
  expect(Lang.tr(key, params)).toBe("Требуется 1 вместо 22 в позиции 5");
  expect(Lang.tr(key, params, "en")).toBe("Expected 1 instead of 22");
  expect(Lang.tr(key, params, "?")).toBe("Expected 1 instead of 22");
  expect(Lang.tr(key, params, "ru-RU")).toBe(
    "Требуется 1 вместо 22 в позиции 5"
  );
});
