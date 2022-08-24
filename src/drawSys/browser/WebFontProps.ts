import { CommonFontFace } from "../CommonFontFace";

export interface WebFontProps {
  hash: string;
  fontFace: CommonFontFace;
  canvasFont: string; // example: "italic bold 18px Arial"
  // see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
  fontFamily: string;
  cssHeight: number;
  italic: boolean;
  bold: boolean;
}
