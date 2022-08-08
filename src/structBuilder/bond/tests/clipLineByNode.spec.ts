import { FigFrame } from "../../../drawSys/figures/FigFrame";
import { ChemNode } from "../../../core/ChemNode";
import { Rect } from "../../../math/Rect";
import { Point } from "../../../math/Point";
import { ChemNodeItem } from "../../../core/ChemNodeItem";
import { PeriodicTable } from "../../../core/PeriodicTable";
import { clipLineByNode } from "../clipLineByNode";

/*
 *   -12-10          0          10 12
 * -6 ┌─────────────────────────────┐
 * -5 │  ┌───────────────────────┐  │
 *    │  │           ∙           │  │
 *  0∙│∙∙│∙∙∙∙∙∙∙∙∙∙∙*∙∙∙∙∙∙∙∙∙∙∙│∙∙│∙
 *    │  │           ∙           │  │
 *  5 │  └───────────────────────┘  │
 *  6 └─────────────────────────────┘
 */

const createInitialData = () => {
  const node = new ChemNode();
  node.items.push(new ChemNodeItem(PeriodicTable.dict.He)); // node must be not empty
  const nodeFrame = new FigFrame();
  nodeFrame.org = new Point();
  nodeFrame.bounds = new Rect(-12, -6, 12, 6);
  const rcNodeCore = new Rect(-10, -5, 10, 5);
  const center = new Point();
  return { node, nodeRes: { nodeFrame, rcNodeCore, center } };
};

describe("clipLineByNode", () => {
  /*    ┌─────┐
   *    │  ^  │
   *    └─────┘
   *       │
   */
  it("to top vertical", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(0, 20);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0.1);
    expect(String(res)).toBe("(0, 5.1)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(0, 20)");
  });
  /*       │
   *    ┌─────┐
   *    │  v  │
   *    └─────┘
   */
  it("to bottom vertical", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(0, -20);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(0, -5)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(0, -20)");
  });

  /*
   *      ┌─────┐
   *    ──│  >  │
   *      └─────┘
   */
  it("to right horizontal", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(-20, 0);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(-10, 0)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(-20, 0)");
  });

  /*
   *    ┌─────┐
   *    │  <  │──
   *    └─────┘
   */
  it("to left horizontal", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(20, 0);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(10, 0)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(20, 0)");
  });

  /*
   *            /
   *    ┌─────┐/
   *    │  <  │
   *    └─────┘
   */
  it("clip by right edge", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(20, -4);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(10, -2)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(20, -4)");
  });
  /*
   *  ┌─────┐
   *  │  >  │
   * /└─────┘
   */
  it("clip by left edge", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(-30, 9);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(-10, 3)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(-30, 9)");
  });

  /*
   *         /
   *    ┌─────┐
   *    │  v  │
   *    └─────┘
   */
  it("clip by top edge", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(9, -15);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(3, -5)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(9, -15)");
  });

  /*
   *    ┌─────┐
   *    │  ^  │
   *    └─────┘
   *     /
   */
  it("clip by bottom edge", () => {
    const { node, nodeRes } = createInitialData();
    const p0 = new Point();
    const p1 = new Point(-100, 100);
    const res = clipLineByNode(node, nodeRes, p0, p1, 0);
    expect(String(res)).toBe("(-5, 5)");
    expect(p0.toString()).toBe("(0, 0)");
    expect(p1.toString()).toBe("(-100, 100)");
  });
});
