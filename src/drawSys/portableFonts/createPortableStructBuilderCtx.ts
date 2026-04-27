import { StructBuilderCtx } from "../../structBuilder/StructBuilderCtx";
import { LocalSvgFont } from "../svg/LocalSvgFont";
import {
  createPortableImgProps,
  ParamsPortableImgProps,
} from "./createPortableImgProps";

export const createPortableStructBuilderCtx = (
  params: ParamsPortableImgProps,
): StructBuilderCtx => ({
  imgProps: createPortableImgProps(params),
  getFont: (props) => new LocalSvgFont(params.mainFont, props),
});
