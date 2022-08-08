import { AbstractSurface } from "../AbstractSurface";
import { FigFrame } from "./FigFrame";

export const renderTopFrame = (frame: FigFrame, surface: AbstractSurface) => {
  surface.setSize(frame.bounds.size);
  frame.draw(frame.bounds.A.neg(), surface);
};
