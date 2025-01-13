import { ChemImgProps } from "../ChemImgProps";
import { SvgFont } from "./svgFont/SvgFont";
import { LocalSvgFont } from "../svg/LocalSvgFont";

/**
 * Create properties for portable surfaces.
 * Unlike createBrowserChemImgProps
 */
export const createPortableImgProps = (params: {
  mainFont: SvgFont;
  fontSize: number;
  fillColor?: string;
  smallFontSize?: number;
}): ChemImgProps => {
  const { mainFont, fontSize, smallFontSize, fillColor = "black" } = params;
  const localFont = new LocalSvgFont(mainFont, {
    family: mainFont.fontFace.fontFamily,
    height: fontSize,
  });
  const style = { fill: fillColor };
  const imgProps = new ChemImgProps({ font: localFont, style });
  const smallFont = new LocalSvgFont(mainFont, {
    family: mainFont.fontFace.fontFamily,
    height: smallFontSize ?? fontSize * 0.7,
  });
  ChemImgProps.getIndexStyles().forEach((styleId) => {
    imgProps.styles[styleId] = {
      font: smallFont,
      style,
    };
  });
  imgProps.init();
  return imgProps;
};
