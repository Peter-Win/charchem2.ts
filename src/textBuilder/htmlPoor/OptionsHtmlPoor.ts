export type PoorHtmlPart = "agentK" | "custom" | "comment";

export type OptionsHtmlPoor = {
  oxidationState?: "ignore" | "sup";
  opComments?: "text" | "ignore" | "script";
  tags?: "std" | "span";
};

export const stdTagsMap: Record<PoorHtmlPart, string> = {
  agentK: "b",
  comment: "em",
  custom: "i",
};
