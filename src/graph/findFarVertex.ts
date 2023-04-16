import { VertexEx } from "./ChemGraph";
import { WithStep } from "./traceGraph";

export const findFarVertex = (
  vertices: VertexEx<WithStep>[]
): VertexEx<WithStep> | undefined => {
  let maxStep = 0;
  let farVertices: VertexEx<WithStep>[] = [];
  vertices.forEach((v) => {
    if (v.step > maxStep) {
      maxStep = v.step;
      farVertices = [];
    }
    if (v.step === maxStep) {
      farVertices.push(v);
    }
  });
  // Считаем, что у лучших вершин валентность ближе к 4
  let bestVertex: VertexEx<WithStep> | undefined;
  let bestDist = 100;
  farVertices.forEach((v) => {
    const dist = Math.abs(4 - v.valence);
    if (
      dist < bestDist ||
      (dist === bestDist && v.index > (bestVertex?.index || 0))
    ) {
      bestDist = dist;
      bestVertex = v;
    }
  });
  return bestVertex;
};
