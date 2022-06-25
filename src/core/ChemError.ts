import { LangParams, Lang } from "../lang/Lang";

export class ChemError extends Error {
  private readonly msgId: string;

  readonly params?: LangParams;

  constructor(msgId: string, params?: LangParams) {
    super(Lang.tr(msgId, params));
    this.msgId = msgId;
    this.params = params;
  }

  getMessage(locale?: string): string {
    return Lang.tr(this.msgId, this.params, locale);
  }
}

export const getErrorMessage = (err: Error, locale?: string): string => {
  if (err instanceof ChemError) {
    if (!locale) return err.getMessage();
    const oldLang = Lang.curLang;
    Lang.curLang = locale;
    const msg = err.getMessage(locale);
    Lang.curLang = oldLang;
    return msg;
  }
  return err.message;
};
