type LocalDict = Record<string, string>;
type LangParam = [string, string | number];

const baseDictRu: LocalDict = {};
const baseDictEn: LocalDict = {};

export class Lang {
  /**
   * Current language
   * Format uses from https://tools.ietf.org/html/rfc7231#section-3.1.3.1
   * Examples: en, ru - internal languages; zh, zh-TW - external (by addDict)
   */
  static curLang: string = "en";

  /**
   * Translate phrase
   * example: Lang.tr("Hello, [first] [last]", listOf("first" to "John", "last" to "Connor"))
   */
  static tr(key: string, params?: LangParam[], langId?: string): string {
    // actual language
    const lang = (!langId ? Lang.curLang : langId).toLowerCase();
    const { dict } = Lang;
    // find local dictionary
    let curDict: LocalDict | undefined = dict[lang];
    if (!curDict) {
      const k = lang.indexOf("-");
      if (k >= 0) curDict = dict[lang.substring(0, k)];
    }
    const finalDict: LocalDict = curDict ?? Lang.enDict;
    // find phrase
    const text = finalDict[key] ?? key;
    // parameters
    return (
      params?.reduce(
        (acc, [name, val]) => acc.replace(`[${name}]`, String(val)),
        text
      ) ?? text
    );
  }

  static findPhrase(key: string): string | undefined {
    return Lang.dict[Lang.curLang]?.[key];
  }

  private static ruDict: LocalDict = baseDictRu;

  private static enDict: LocalDict = baseDictEn;

  private static dict: Record<string, LocalDict> = {
    en: Lang.enDict,
    ru: Lang.ruDict,
  };
}
