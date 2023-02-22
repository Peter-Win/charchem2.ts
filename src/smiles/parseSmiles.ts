import { DraftGraph } from "../graph/DraftGraph";

export const parseSmilesDraft = (code: string): DraftGraph => {
  const g = new DraftGraph();
  let pos = 0;
  while (pos < code.length) {
    const c = code[pos++];
    if (c === "[") {
      break;
    }
  }
  return g;
};
