import { Int } from "../types";
import { ChemNode } from "../core/ChemNode";
import { ChemAgent } from "../core/ChemAgent";
import { DraftGraph } from "./DraftGraph";
import { ChemError } from "../core/ChemError";
import { draftGraphFromAutoNode } from "./agent/draftGraphFromAutoNode";
import { draftGraphFromNode } from "./agent/draftGraphFromNode";
import { linkDraftVertices } from "./agent/linkDraftVertices";

export const makeGraphFromAgent = (agent: ChemAgent): DraftGraph => {
  const graph = new DraftGraph();
  const nodesMap: Record<Int, DraftGraph> = {};
  const { bonds } = agent;

  agent.walk({
    comma() {
      throw new ChemError("Cant make graph from mineral series");
    },
    nodePre(obj: ChemNode) {
      const gr = obj.autoMode
        ? draftGraphFromAutoNode(obj)
        : draftGraphFromNode(obj);
      graph.addGraph(gr);
      nodesMap[obj.index] = gr;
    },
  });
  bonds.forEach((bond) => linkDraftVertices(graph, bond, nodesMap));
  graph.vertices.forEach((v) => {
    if (v.reserved) {
      // eslint-disable-next-line no-param-reassign
      (v as unknown as { valence: Int }).valence -=
        v.reserved + (v.charge ?? 0);
    }
  });
  return graph;
};
