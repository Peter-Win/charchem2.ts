interface TextStyleCommon {
  mode?: "open" | "close";
}

interface TextStyleItalic extends TextStyleCommon {
  tag: "i";
}
interface TextStyleBold extends TextStyleCommon {
  tag: "b";
}
interface TextStyleSuper extends TextStyleCommon {
  tag: "sup";
}
interface TextStyleSub extends TextStyleCommon {
  tag: "sub";
}
interface TextStyleColor extends TextStyleCommon {
  tag: "color";
  color: string;
}

export type TextStyle =
  | TextStyleItalic
  | TextStyleBold
  | TextStyleSuper
  | TextStyleSub
  | TextStyleColor;
