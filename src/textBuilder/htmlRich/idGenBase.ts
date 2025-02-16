import { IdGenerator } from "./OptionsHtmlRich";

export const idGenBase = (base: string, forAllNodes?: boolean): IdGenerator => {
  let index = 0;
  return (node) => (node || forAllNodes ? `${base}${++index}` : undefined);
};
