import { Double } from "../types";
import { ChemNode } from "./ChemNode";
import { ChemObj } from "./ChemObj";

export interface ParamsChemBackground {
  shape?: string; // round, ellipse or rect
  padding?: Double[]; // [all], [vert, horiz], [top, horiz, bottom], [top, l, bot, r]
  isAll?: boolean;
  nodes?: ChemNode[];
  borderRadius?: Double;
  fill?: string;
  stroke?: string;
  strokeWidth?: Double;
}

/**
 * $background()
 */
export class ChemBackground extends ChemObj {
  constructor(public readonly params: ParamsChemBackground) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  override walk(): void {}
}

export const createBackground = (
  params: ParamsChemBackground,
  curNode: ChemNode
): ChemBackground => {
  if (!params.isAll) {
    // eslint-disable-next-line no-param-reassign
    params.nodes = params.nodes ?? [];
    params.nodes.push(curNode);
  }
  return new ChemBackground(params);
};
