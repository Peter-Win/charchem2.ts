import version from "./version";

export const getVersion = () => version as [number, number, number];

export const getVersionStr = (): string => getVersion().join(".");
