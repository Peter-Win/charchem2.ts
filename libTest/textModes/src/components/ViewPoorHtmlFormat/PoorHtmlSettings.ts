import { OptionsHtmlPoor } from "charchem2/textBuilder/htmlPoor/OptionsHtmlPoor";
import { Option } from "../ui/Option";

export type PoorHtmlSettings = OptionsHtmlPoor;

export const initialPoorHtmlSettings: PoorHtmlSettings = {
  oxidationState: "ignore",
  opComments: "text",
  tags: "std",
};

export const htmlPoorOxiStates: Option<PoorHtmlSettings["oxidationState"]>[] = [
  { value: "ignore", label: "Ignore" },
  { value: "sup", label: "Superscript" },
];

export const htmlPoorOpComms: Option<PoorHtmlSettings["opComments"]>[] = [
  { value: "text", label: "Text" },
  { value: "ignore", label: "Ignore" },
  { value: "script", label: "Script" },
];

export const htmlPoorTags: Option<PoorHtmlSettings["tags"]>[] = [
  { value: "std", label: "Different tags" },
  { value: "span", label: "Span only" },
];
