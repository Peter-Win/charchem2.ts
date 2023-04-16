import { compile } from "../../compiler/compile";
import { makeGraphFromAgent } from "../makeGraphFromAgent";
import { removeHydrogen } from "../removeHydrogens";
import { traceGraph, WithStep } from "../traceGraph";
import { makeChemGraph } from "../makeChemGraph";
import { backFindPath } from "../buildSpanningTree";

test("backFindPath", () => {
  //     OH    Cl8          0*     4
  //     |     |            |  *  |
  // 6 / 1\\2/ 7\\ 9    2 /1*\\2/3*\\ 4*
  //  ||    |     |      ||    |     |
  // 5 \  //3\11// 10   3 \  //3\ 4// 5*
  //     4     |            4     |
  //           F12                5

  const expr = compile("OH|\\|`//`\\`||/\\/<`|Cl>\\\\|`//<|F>`\\");
  expect(expr.getMessage()).toBe("");
  const draftH = makeGraphFromAgent(expr.getAgents()[0]!);
  const draft = removeHydrogen(draftH);
  const g = makeChemGraph<WithStep>(draft, { step: 0 }, {});
  traceGraph(g);

  const v10 = g.vertices[10]!;
  expect(v10.index).toBe(10);
  expect(v10.step).toBe(5);
  const path = backFindPath(g, v10);
  expect(path.vertices.length).toBe(6);
  expect(path.edges.length).toBe(5);
  expect(path.vertices.map(({ index }) => index)).toEqual([0, 1, 2, 7, 9, 10]);
  expect(path.vertices.map(({ step }) => step)).toEqual([0, 1, 2, 3, 4, 5]);
  expect(path.edges.map(({ v0, v1 }) => `${v0}-${v1}`)).toEqual([
    "0-1",
    "1-2",
    "2-7",
    "7-9",
    "9-10",
  ]);

  path.vertices.forEach((v) => {
    // eslint-disable-next-line no-param-reassign
    v.step = -1;
  });
  const v12 = g.vertices[12]!;
  expect(v12.index).toBe(12);
  expect(v12.step).toBe(5);
  const path1 = backFindPath(g, v12);
  expect(path1.vertices.map(({ step }) => step)).toEqual([3, 4, 5]);
  expect(path1.vertices.map(({ index }) => index)).toEqual([3, 11, 12]);
  expect(path1.edges.map(({ v0, v1 }) => `${v0}-${v1}`)).toEqual([
    "11-3",
    "11-12",
  ]);
});
