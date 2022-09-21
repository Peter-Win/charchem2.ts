import { Lang, LocalDict } from "../Lang";

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

describe("Lang.addDict", () => {
  let originalDict: Record<string, LocalDict>;
  beforeAll(() => {
    originalDict = { ...Lang.dict };
  });
  afterAll(() => {
    Lang.dict = originalDict;
  });
  it("new dictionary", () => {
    expect(Lang.tr("H", {}, "it")).toBe("Hydrogen");
    expect(Lang.tr("He", {}, "it")).toBe("Helium");
    Lang.addDict({ it: { H: "Idrogeno" } });
    expect(Lang.tr("H", {}, "it")).toBe("Idrogeno");
    Lang.addDict({ it: { He: "Elio" } });
    expect(Lang.tr("He", {}, "it")).toBe("Elio");
  });
  it("append existing dictionary", () => {
    expect(Lang.tr("Me", {}, "en")).toBe("Me");
    Lang.addDict({ en: { Me: "Methyl" } });
    expect(Lang.tr("Me", {}, "en")).toBe("Methyl");
  });
});
