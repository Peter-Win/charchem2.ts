import { isPropMatch } from "../isPropMatch";
import { FontWeight, FontStyle } from "../../FontTypes";

describe("isPropMatch", () => {
  it("weight", () => {
    const weight: FontWeight = "bold";
    expect(isPropMatch(weight, "")).toBe(false);
    expect(isPropMatch(weight, "all")).toBe(true);
    expect(isPropMatch(weight, "BOLD")).toBe(true);
    expect(isPropMatch(weight, "600, bold, 800")).toBe(true);
    expect(isPropMatch(weight, "600, 700, 800")).toBe(false); // Synonyms are not taken into account here.
  });
  it("style", () => {
    const style: FontStyle = "italic";
    expect(isPropMatch(style, "")).toBe(false);
    expect(isPropMatch(style, "Italic")).toBe(true);
    expect(isPropMatch(style, "normal, italic")).toBe(true);
    expect(isPropMatch(style, "normal")).toBe(false);
  });
});
