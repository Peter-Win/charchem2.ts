import { PathStyle } from "../../AbstractSurface";
import { style2ps } from "../style2ps";

describe("style2ps", () => {
  it("fill", () => {
    const style: PathStyle = {
      join: "round",
      fill: "black",
    };
    expect(style2ps(style)).toEqual([
      "1 setlinejoin",
      "0 0 0 setrgbcolor",
      "fill",
    ]);
  });
  it("stroke", () => {
    const style: PathStyle = {
      join: "round",
      cap: "square",
      stroke: "#FF0000",
      strokeWidth: 5,
    };
    expect(style2ps(style)).toEqual([
      "2 setlinecap",
      "1 setlinejoin",
      "5 setlinewidth",
      "1 0 0 setrgbcolor",
      "stroke",
    ]);
  });
});
