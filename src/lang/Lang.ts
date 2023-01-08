import { ifDef } from "../utils/ifDef";
import { baseDictEn } from "./baseDictEn";
import { baseDictRu } from "./baseDictRu";
import { LocalDict, LangParams } from "./LangTypes";
import { replaceLangParams } from "./replaceLangParams";

export class Lang {
  /**
   * Current language
   * Format uses from https://tools.ietf.org/html/rfc7231#section-3.1.3.1
   * Examples: en, ru - internal languages; zh, zh-TW - external (by addDict)
   */
  static curLang: string = "en";

  static navLang: string | undefined = undefined;

  /**
   * Translate phrase
   * example: Lang.tr("Hello, [first] [last]", listOf("first" to "John", "last" to "Connor"))
   */
  static tr(key: string, params?: LangParams, langId?: string): string {
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
    return replaceLangParams({ text, params, langId, tr: Lang.tr });
  }

  static findPhrase(key: string): string | undefined {
    return Lang.dict[Lang.curLang]?.[key];
  }

  private static ruDict: LocalDict = baseDictRu;

  private static enDict: LocalDict = baseDictEn;

  static dict: Record<string, LocalDict> = {
    en: Lang.enDict,
    ru: Lang.ruDict,
  };

  static addDict(globalDictUpdates: Record<string, LocalDict>) {
    const { dict } = Lang;
    Object.entries(globalDictUpdates).forEach(([locale, locDict]) => {
      if (!dict[locale]) {
        dict[locale] = locDict;
      } else {
        dict[locale] = { ...dict[locale], ...locDict };
      }
    });
  }
}

if (typeof window !== "undefined") {
  Lang.navLang = (
    navigator.language ||
    // @ts-ignore
    navigator.browserLanguage ||
    // @ts-ignore
    navigator.userLanguage ||
    "en"
  ).toLowerCase();

  ifDef(Lang.navLang, (navLang) => {
    if (navLang in Lang.dict) {
      Lang.curLang = navLang;
    } else if (navLang.indexOf("-") >= 0) {
      const loc = navLang.split("-")[0]!;
      if (loc in Lang.dict) {
        Lang.curLang = loc;
      }
    }
  });
}
