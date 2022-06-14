import { LocalFontProps } from "../AbstractSurface";
import { fontWeightValue } from "./fontWeightValue";

export const createLocalFontHash = (props: LocalFontProps): string => {
  let hash = `family:${props.family};height:${props.height};`;
  if (props.weight) {
    const v = fontWeightValue(props.weight);
    if (v !== 400) hash += `weight:${v};`;
  }
  if (props.style && props.style !== "normal") hash += `style:${props.style};`;
  if (props.stretch && props.stretch !== "normal")
    hash += `stretch:${props.stretch};`;
  return hash;
};
