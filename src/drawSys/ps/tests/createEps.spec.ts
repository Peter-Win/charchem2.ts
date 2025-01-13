import path from "node:path";
import fs from "node:fs";
import { createTestFile } from "../../../tests/createTestFile";
import { FigFrame } from "../../figures/FigFrame";
import { FigPath } from "../../figures/FigPath";
import { parsePath } from "../../utils/parsePath";
import { createEps } from "../createEps";
import { compile } from "../../../compiler/compile";
import { SvgFont } from "../../portableFonts/svgFont/SvgFont";
import { SvgSurfacePortable } from "../../svg/SvgSurfacePortable";
import { renderTopFrame } from "../../figures/renderTopFrame";
import { standaloneExportOptions } from "../../svg/standaloneExportOptions";
import { buildExpression } from "../../../structBuilder/buildExpression";
import { FigEllipse } from "../../figures/FigEllipse";
import { Point } from "../../../math/Point";
import { createPortableImgProps } from "../../portableFonts/createPortableImgProps";

describe("createEps", () => {
  it("stroke path", async () => {
    const frame = new FigFrame();
    frame.bounds.B.set(100, 100);
    frame.addFigure(
      new FigPath(parsePath("M 10 10 L 90 90 L 90 10 Q 90 90 10 90z"), {
        stroke: "black",
        strokeWidth: 5,
        cap: "round",
        join: "round",
      })
    );
    const title = "Stroke path";
    const surface = createEps({ frame, title });
    const data = surface.exportText();
    await createTestFile(__dirname, "stroke.eps", data);
    expect(data).toMatch(/\s1 setlinecap\n/);
    expect(data).toMatch(/\s1 setlinejoin\n/);
    expect(data).toMatch(/\s5 setlinewidth\n/);
  });

  it("ellipse", async () => {
    const frame = new FigFrame();
    frame.bounds.B.set(100, 100);
    frame.addFigure(
      new FigEllipse(new Point(50, 50), new Point(45, 20), {
        stroke: "#0FF",
        strokeWidth: 5,
      })
    );
    const title = "Ellipse demo";
    const surface = createEps({ frame, title });
    const data = surface.exportText();
    await createTestFile(__dirname, "ellipse.eps", data);
    expect(data).toMatch(/\s0 1 1 setrgbcolor\n/);
    expect(data).toMatch(/\s5 setlinewidth\n/);
    expect(data).toMatch(/\s50 30 moveto\n/);
    expect(data).toMatch(/\s95 50 curveto\n/);
    expect(data).toMatch(/\s50 70 curveto\n/);
  });

  it("skeletal", async () => {
    const title = "Skeletal formula";
    const formula =
      "CH2_(y1.2)CH2_pN<_(A120)H3C>_pHC_pH2C_p; #-2`-C`/CH_p6HC_p6HC_p6N_p6CH_p6_o";
    const expr = compile(formula);
    expect(expr.getMessage()).toBe("");

    const fontName = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "static",
      "fonts",
      "Cambria-regular.svg"
    );
    const fontBody = await fs.promises.readFile(fontName, {
      encoding: "utf-8",
    });
    const mainFont = SvgFont.create(fontBody);

    const imgProps = createPortableImgProps({
      mainFont,
      fontSize: 18,
      fillColor: "black",
    });

    // Build formula image in abstract format
    const { frame } = buildExpression(expr, imgProps);

    // SVG
    const svgSurface = new SvgSurfacePortable(mainFont);
    renderTopFrame(frame, svgSurface);
    await createTestFile(
      __dirname,
      "skeletal.svg",
      svgSurface.exportText(standaloneExportOptions)
    );

    // EPS
    const psSurface = createEps({ frame, title });
    await createTestFile(__dirname, "skeletal.eps", psSurface.exportText());
  });
});
