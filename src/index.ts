import { getVersion, getVersionStr } from "./getVersion";

export const ChemSys = Object.freeze({
  get ver(): number[] {
    return getVersion();
  },
  get verStr(): string {
    return getVersionStr();
  },
});
