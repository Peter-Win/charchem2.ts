import { LangParams, Lang } from "../lang/Lang";

export class ChemError extends Error {
  private readonly msgId: string;

  private readonly params?: LangParams;

  constructor(msgId: string, params?: LangParams) {
    super(Lang.tr(msgId, params));
    this.msgId = msgId;
    this.params = params;
  }

  getMessage(locale?: string): string {
    return Lang.tr(this.msgId, this.params, locale);
  }
}
