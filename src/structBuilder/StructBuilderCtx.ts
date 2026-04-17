import {
  AbstractSurface,
  LocalFont,
  LocalFontProps,
} from "../drawSys/AbstractSurface";
import { ChemImgProps } from "../drawSys/ChemImgProps";

export type StructBuilderCtx = {
  imgProps: ChemImgProps;
  getFont(props: LocalFontProps): LocalFont;
};

export const createStructBuilderCtx = (
  surface: AbstractSurface,
  imgProps: ChemImgProps
): StructBuilderCtx => ({
  imgProps,
  getFont: (props) => surface.getFont(props),
});
