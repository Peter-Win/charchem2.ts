import { CommonFontFace } from "../CommonFontFace";

export const getBaseline = ({ ascent }: CommonFontFace): number => ascent;

export const getFontHeight = ({ ascent, descent }: CommonFontFace): number =>
  ascent - descent;
