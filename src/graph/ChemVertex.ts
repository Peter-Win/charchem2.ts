import { Int } from "../types";
import { ChemSubObj } from "../core/ChemSubObj";

export interface ChemVertex {
  readonly index: Int;
  readonly subObj: ChemSubObj;
  readonly valence: Int;
}
