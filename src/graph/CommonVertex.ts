import { Int } from "../types";
import { ChemSubObj } from "../core/ChemSubObj";

export interface CommonVertex {
  content: ChemSubObj;
  valence: Int;
  charge?: Int;
  hydrogen?: Int;
  mass?: Int;
}
