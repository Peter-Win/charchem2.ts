import { ChemError } from "../core/ChemError";
import { ChemGraph } from "../graph/ChemGraph";
import { NomChunk } from "./NomChunk";
import { updateNomenclatureDict } from "./nameBuild/updateNomenclatureDict";

export interface OptionsBuildPIN {
  lang?: string;
}

/* eslint @typescript-eslint/no-unused-vars: "off" */

export const buildPreferredIupacName = (
  graph: ChemGraph,
  options?: OptionsBuildPIN
): NomChunk[] => {
  updateNomenclatureDict();
  throw new ChemError("Cant build PIN");
};
