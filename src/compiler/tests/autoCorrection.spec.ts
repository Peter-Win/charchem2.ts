import { ChemAgent } from "../../core/ChemAgent";
import { ifDef } from "../../utils/ifDef";
import { compile } from "../compile";
import { Point, pointFromDeg } from "../../math/Point";

const getAngle = (agent: ChemAgent, i: number = 1): number | undefined =>
  ifDef(agent.bonds[i]?.dir?.polarAngleDeg(), (it) => Math.round(it));

describe("autoCorrection", () => {
  it("NotAutoNode", () => {
    const expr = compile("H3C--O\\CH3");
    expect(expr.getMessage()).toBe("");
    expect(getAngle(expr.getAgents()[0]!)).toBe(60);
  });
  it("Horizontal And Slope External", () => {
    //  __/ __  \__  __
    //        \     /
    const expr = compile("-/ -\\ `-`\\ `-`/");
    expect(expr.getMessage()).toBe("");
    const a = expr.getAgents();
    expect(a).toHaveLength(4);
    expect(getAngle(a[0]!)).toBe(-60);
    expect(getAngle(a[1]!)).toBe(60);
    expect(getAngle(a[2]!)).toBe(-120);
    expect(getAngle(a[3]!)).toBe(120);
    expect(a[0]!.bonds[1]!.isCorr).toBe(true);
    expect(a[1]!.bonds[1]!.isCorr).toBe(true);
    expect(a[2]!.bonds[1]!.isCorr).toBe(true);
    expect(a[3]!.bonds[1]!.isCorr).toBe(true);
    expect(a[0]!.nodes[2]!.pt.toString()).toBe(
      new Point(1.0, 0.0).plus(pointFromDeg(-60.0)).toString()
    );
  });
  it("Horizontal And Slope Internal", () => {
    //
    //   _\ __  /_  __
    //       /      \
    const expr = compile("-`\\ -`/ `-/ `-\\");
    expect(expr.getMessage()).toBe("");
    const a = expr.getAgents();
    expect(a).toHaveLength(4);
    expect(getAngle(a[0]!)).toBe(-120);
    expect(getAngle(a[1]!)).toBe(120);
    expect(getAngle(a[2]!)).toBe(-60);
    expect(getAngle(a[3]!)).toBe(60);
  });
  it("Corrected Slope And Slope", () => {
    // __         __
    //   \    \  /    /
    //   /  __/  \    \__
    const expr = compile("-\\`/ -/`\\ `-`/\\ `-`\\/");
    expect(expr.getMessage()).toBe("");
    const a = expr.getAgents();
    expect(a).toHaveLength(4);

    expect(getAngle(a[0]!)).toBe(60);
    expect(a[0]!.bonds[1]!.isCorr).toBe(true);
    expect(getAngle(a[0]!, 2)).toBe(120);
    expect(a[0]!.bonds[2]!.isCorr).toBe(true);

    expect(getAngle(a[1]!)).toBe(-60);
    expect(getAngle(a[1]!, 2)).toBe(-120);
    expect(a[1]!.bonds[1]!.isCorr).toBe(true);
    expect(a[1]!.bonds[2]!.isCorr).toBe(true);

    expect(getAngle(a[2]!)).toBe(120);
    expect(getAngle(a[2]!, 2)).toBe(60);

    expect(getAngle(a[3]!)).toBe(-120);
    expect(getAngle(a[3]!, 2)).toBe(-60);

    const p2 = new Point(1.0, 0.0).plus(pointFromDeg(60.0));
    expect(a[0]!.nodes[2]!.pt.toString()).toBe(String(p2));
    expect(a[0]!.nodes[3]!.pt.toString()).toBe(
      p2.plus(pointFromDeg(120.0)).toString()
    );
  });
  it("Two Slopes With Double Correction", () => {
    //        /  \
    //  \  /  \  /
    //  /  \
    //
    const expr = compile("\\`/ `/\\ `\\/ /`\\ ");
    expect(expr.getMessage()).toBe("");
    const a = expr.getAgents();
    expect(a).toHaveLength(4);

    expect(getAngle(a[0]!)).toBe(120);
    expect(getAngle(a[0]!, 0)).toBe(60);
    expect(a[0]!.nodes[1]!.pt.toString()).toBe(pointFromDeg(60.0).toString());
    expect(a[0]!.nodes[2]!.pt.toString()).toBe(
      pointFromDeg(60.0).plus(pointFromDeg(120.0)).toString()
    );

    expect(getAngle(a[1]!, 0)).toBe(120);
    expect(getAngle(a[1]!)).toBe(60);
    expect(a[1]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(120.0)));
    expect(a[1]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(120.0).plus(pointFromDeg(60.0)))
    );

    expect(getAngle(a[2]!, 0)).toBe(-120);
    expect(getAngle(a[2]!)).toBe(-60);
    expect(a[2]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-120.0)));
    expect(a[2]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-120.0).plus(pointFromDeg(-60.0)))
    );

    expect(getAngle(a[3]!, 0)).toBe(-60);
    expect(getAngle(a[3]!)).toBe(-120);
    expect(a[3]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-60.0)));
    expect(a[3]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-60.0).plus(pointFromDeg(-120.0)))
    );
  });
  it("Prev Slope With Horizontal", () => {
    //           o      o              o o
    //    __  __  \__  /_  __   __  __/  _\
    //   /    \              \   /
    //  o      o              o o
    const expr = compile("/- `\\- \\- `/- `\\`- /`- `/`- \\`-");
    expect(expr.getMessage()).toBe("");
    const a = expr.getAgents();
    expect(a).toHaveLength(8);

    expect(getAngle(a[0]!, 0)).toBe(-60);
    expect(getAngle(a[1]!, 0)).toBe(-120);
    expect(getAngle(a[2]!, 0)).toBe(60);
    expect(getAngle(a[3]!, 0)).toBe(120);
    expect(getAngle(a[4]!, 0)).toBe(-120);
    expect(getAngle(a[5]!, 0)).toBe(-60);
    expect(getAngle(a[6]!, 0)).toBe(120);
    expect(getAngle(a[7]!, 0)).toBe(60);

    expect(a[0]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-60.0)));
    expect(a[0]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-60.0).plus(new Point(1.0, 0.0)))
    );
    expect(a[1]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-120.0)));
    expect(a[1]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-120.0).plus(new Point(1.0, 0.0)))
    );
    expect(a[2]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(60.0)));
    expect(a[2]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(60.0).plus(new Point(1.0, 0.0)))
    );
    expect(a[3]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(120.0)));
    expect(a[3]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(120.0).plus(new Point(1.0, 0.0)))
    );
    expect(a[4]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-120.0)));
    expect(a[4]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-120.0).minus(new Point(1.0, 0.0)))
    );
    expect(a[5]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(-60.0)));
    expect(a[5]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(-60.0).minus(new Point(1.0, 0.0)))
    );
    expect(a[6]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(120.0)));
    expect(a[6]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(120.0).minus(new Point(1.0, 0.0)))
    );
    expect(a[7]!.nodes[1]!.pt.toString()).toBe(String(pointFromDeg(60.0)));
    expect(a[7]!.nodes[2]!.pt.toString()).toBe(
      String(pointFromDeg(60.0).minus(new Point(1.0, 0.0)))
    );
  });
  it("Node Coordinates", () => {
    // 0\
    //  1\_____2
    //   /
    // 3/
    const expr = compile("\\<->`/");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0];
    expect(
      agent!.bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))
    ).toEqual([60, 0, 120]);
    expect(agent!.nodes.map((it) => String(it.pt))).toEqual([
      "(0, 0)",
      String(pointFromDeg(60.0)),
      String(pointFromDeg(60.0).plus(new Point(1.0, 0.0))),
      String(pointFromDeg(60.0).plus(pointFromDeg(120.0))),
    ]);
  });
  it("Prevent Auto Correction", () => {
    const expr = compile("$slope(30)-/");
    expect(expr.getMessage()).toBe("");
    expect(getAngle(expr.getAgents()[0]!)).toBe(-30);
  });

  const pts2s = (pts: Point[]) => pts.map((p) => String(p));
  const q32 = Math.sqrt(3.0) / 2.0;

  it("Coordinates Correction", () => {
    //  60°       60°60°
    // __/⸌30° -> __/\__
    //     |         |
    const expr = compile("-/\\<|>-");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0];
    expect(pts2s(agent!.nodes.map((it) => it.pt))).toEqual(
      pts2s([
        new Point(),
        new Point(1.0, 0.0),
        new Point(1.5, -q32),
        new Point(2.0, 0.0),
        new Point(2.0, 1.0),
        new Point(3.0, 0.0),
      ])
    );
  });
  it("Coordinates Correction 2", () => {
    //      __       __
    // 30°⸌/60° -> \/
    //             /
    //
    const expr = compile("\\<_(A-60)->`/");
    expect(expr.getMessage()).toBe("");
    expect(pts2s(expr.getAgents()[0]!.nodes.map((it) => it.pt))).toEqual(
      pts2s([
        new Point(),
        new Point(0.5, q32),
        new Point(1.0, 0.0),
        new Point(2.0, 0.0),
        new Point(0.0, 2 * q32),
      ])
    );
  });
  it("NoCorrectionIV", () => {
    const expr = compile("|\\/");
    expect(expr.getMessage()).toBe("");
    const agent = expr.getAgents()[0];
    expect(
      agent!.bonds.map((it) => Math.round(it.dir!.polarAngleDeg()))
    ).toEqual([90, 30, -30]);
    expect(pts2s(agent!.nodes.map((it) => it.pt))).toEqual(
      pts2s([
        new Point(),
        new Point(0.0, 1.0),
        new Point(q32, 1.5),
        new Point(q32 * 2, 1.0),
      ])
    );
  });
});
