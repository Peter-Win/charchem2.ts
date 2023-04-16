import { Lang } from "../../lang";
import { nomenclatureDict } from "./nomenclatureDict";

export const updateNomenclatureDict = () => {
  if (!Lang.findPhrase("mono_num")) {
    Lang.addDict(nomenclatureDict);
  }
};
