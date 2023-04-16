import { Int } from "../types";
import { CommonVertex } from "./CommonVertex";
import { CommonEdge } from "./CommonEdge";

export interface Vertex extends Readonly<CommonVertex> {
  readonly index: Int;
  readonly edges: Int[];
}

export interface Edge extends Readonly<CommonEdge> {
  readonly index: Int;
  readonly v0: Int;
  readonly v1: Int;
}

export type VertexEx<TV extends {}> = Vertex & TV;

export type EdgeEx<TE extends {}> = Edge & TE;

export class ChemGraph<TV extends {} = {}, TE extends {} = {}> {
  vertices: VertexEx<TV>[] = [];

  edges: EdgeEx<TE>[] = [];
}

export const otherVertex = ({ v0, v1 }: Edge, vIndex: Int): Int =>
  v0 === vIndex ? v1 : v0;

export const getChiralDir = (
  { v1, chiralDir }: Edge,
  vIndex: Int
): -1 | 0 | 1 =>
  vIndex === v1 ? (-(chiralDir ?? 0) as -1 | 0 | 1) : chiralDir ?? 0;
