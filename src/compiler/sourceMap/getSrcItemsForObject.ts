import { ChemObj } from "../../core/ChemObj";
import { SrcMapItem } from "./SrcMapItem";

export const getSrcItemsForObject = (
  needObj: ChemObj,
  srcMap?: SrcMapItem[]
): SrcMapItem[] => srcMap?.filter(({ obj }) => needObj === obj) ?? [];
