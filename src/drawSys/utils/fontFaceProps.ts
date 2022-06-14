import { CommonFontFace, BBoxIndex } from "../CommonFontFace";

export const getBaseline = ({ bbox, ascent }: CommonFontFace): number => {
  const top = bbox && bbox[BBoxIndex.top];
  return top || ascent;
};

export const getFontHeight = ({
  bbox,
  ascent,
  descent,
}: CommonFontFace): number => {
  const boxHeight = bbox && bbox[BBoxIndex.top] - bbox[BBoxIndex.bottom];
  return boxHeight || ascent - descent;
};
