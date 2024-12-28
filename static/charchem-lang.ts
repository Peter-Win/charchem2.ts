/**
 * Connecting an international dictionary.
 * Only for use via the <script> tag.
 * In other cases, file "/src/internationalDict" should be used directly.
 */

import {internationalDict} from  "../src/internationalDict";
import {LocalDict} from "../src/lang/LangTypes";

declare global {
  const ChemSys: {
    addDict(globalDict: Record<string, LocalDict>): void;
  }
}

ChemSys.addDict(internationalDict);