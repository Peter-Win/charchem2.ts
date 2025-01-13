import { FigFrame } from "../figures/FigFrame";
import { renderTopFrame } from "../figures/renderTopFrame";
import { PsSurface } from "./PsSurface";

type ParamsCreateEps = {
  frame: FigFrame;
  title?: string; // without %%
};

export const createEps = ({ frame, title }: ParamsCreateEps): PsSurface => {
  const surface = new PsSurface();

  const { size } = frame.bounds;
  surface.addPrologLine("%!PS-Adobe-3.0 EPSF-3.0");
  surface.addPrologLine(
    `%%BoundingBox: 0 0 ${Math.ceil(size.x)} ${Math.ceil(size.y)}`
  );
  surface.addCreator();
  surface.addTitle(title);

  surface.addCmdLines(["gsave", `0 ${size.y} translate`, "1 -1 scale"]);
  renderTopFrame(frame, surface);
  surface.addCmdLine("grestore");
  return surface;
};
