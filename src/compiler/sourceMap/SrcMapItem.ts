import { ChemObj } from "../../core/ChemObj";

export type SpecPart = "agentK";

export interface SrcMapItem {
  begin: number;
  end: number;
  obj: ChemObj;
  part?: SpecPart;
}
