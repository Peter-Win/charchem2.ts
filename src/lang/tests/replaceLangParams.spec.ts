import { LangParams } from "../LangTypes";
import { replaceLangParams } from "../replaceLangParams";

const testDict: Record<string, Record<string, string>> = {
  en: {
    SideTurn: "[Side] turn",
  },
  ru: {
    SideTurn: "Поворот [Side]",
    Left: "налево",
    Right: "направо",
  },
};

const testTr = (key: string, params?: LangParams, langId?: string): string => {
  const dict: Record<string, string> = testDict[langId ?? "en"] ?? testDict.en!;
  return dict[key] ?? key;
};

describe("replaceLangParams", () => {
  it("without parameters", () => {
    expect(replaceLangParams({ text: "Hello!", tr: testTr })).toBe("Hello!");
  });
  it("simple parameters", () => {
    expect(
      replaceLangParams({
        text: "Hello, [name]! Count=[count]",
        params: { name: "Abc", count: 321 },
        tr: testTr,
      })
    ).toBe("Hello, Abc! Count=321");
  });
  it("nested parameters", () => {
    expect(
      replaceLangParams({
        text: "[Side#] turn",
        params: { Side: "Left" },
        tr: testTr,
      })
    ).toBe("Left turn");
    expect(
      replaceLangParams({
        text: "[Side#] turn",
        params: { Side: "Right" },
        tr: testTr,
      })
    ).toBe("Right turn");
    expect(
      replaceLangParams({
        text: "Поворот [Side#]",
        params: { Side: "Left" },
        tr: testTr,
        langId: "ru",
      })
    ).toBe("Поворот налево");
    expect(
      replaceLangParams({
        text: "Поворот [Side#]",
        params: { Side: "Right" },
        tr: testTr,
        langId: "ru",
      })
    ).toBe("Поворот направо");
  });
});
