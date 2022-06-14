import version from "./version.json";

export const getVersion = (): number[] => version;

export const getVersionStr = (): string => getVersion().join(".");
