import fs from "fs";
import path from "path";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { createTestSurface, saveSurface } from "../tests/testEnv";
import { parsePath } from "../../drawSys/utils/parsePath";
import { tracePath } from "../../drawSys/utils/tracePath";
import { Point } from "../../math/Point";
import { PathSeg } from "../../drawSys/path";
import { FigPath } from "../../drawSys/figures/FigPath";
import { Rect, updateRect } from "../../math/Rect";
import { Figure } from "../../drawSys/figures/Figure";
import { AbstractSurface } from "../../drawSys/AbstractSurface";
import { SvgSurface } from "../../drawSys/svg/SvgSurface";

const g = {
  parenLeft: `M739 -435q-170 0 -277.5 51t-167.5 155.5t-87 271.5t-27 453q0 284 26.5 452.5t86.5 274.5t168 159t278 53v-82q-70 0 -124 -12q-61 -14 -104 -54q-48 -44 -78 -123q-35 -92 -52 -244q-18 -161 -18 -416q0 -225 15 -382.5t50 -257.5q28 -84 70 -131q37 -41 88 -62
  q59 -24 153 -24v-82z`,
  parenRight:
    "M43 1435q170 0 277.5 -51t167.5 -155.5t87 -271.5t27 -453q0 -284 -26.5 -452.5t-86.5 -274.5t-168 -159t-278 -53v82q70 0 124 12q61 14 104 54q48 44 78 123q35 92 52 244q18 161 18 416q0 225 -15 382.5t-50 257.5q-28 84 -70 131q-37 41 -88 62q-59 24 -153 24v82z",

  bracketLeft: "M674 -430h-446v1861h446v-82h-270v-1697h270v-82z",
  bracketRightAlt: "M489 -230h-446v82h270v1537h-270v82h446v-1701z",

  braceLeft: `M724 -432q-155 0 -245 40t-129 119.5t-39 213.5v289q0 89 -22.5 138.5t-67.5 69.5t-126 20v82q80 0 125 20t68 69t23 139v289q0 134 39 213.5t129 119.5t245 40h26v-81q-79 0 -118.5 -8.5t-64 -25.5t-40.5 -44t-25 -75t-9 -127v-194q0 -101 -17.5 -168.5t-62.5 -117
    t-123 -81.5v-18q76 -31 122.5 -82t63.5 -119.5t17 -165.5v-194q0 -79 9 -127t25 -75t40.5 -44t64 -25.5t118.5 -8.5v-81h-26z`,
  braceRight: `M69 1430q155 0 245 -40t129 -119.5t39 -213.5v-289q0 -90 23 -139t68 -69t125 -20v-82q-81 0 -126 -20t-67.5 -69.5t-22.5 -138.5v-289q0 -134 -39 -213.5t-129 -119.5t-245 -40h-26v81q79 0 118.5 8.5t64 25.5t40.5 44t25 75t9 127v194q0 101 17.5 168.5t62.5 117
    t123 81.5v18q-76 31 -122.5 82t-63.5 119.5t-17 165.5v194q0 79 -9 127t-25 75t-40.5 44t-64 25.5t-118.5 8.5v81h26z`,

  braceLeftBottom:
    "M596 0v801q0 831 177.5 1251.5t591.5 492.5v-95q-293 -69 -426 -464t-133 -1219v-767h-210z",
  braceLeftMid:
    "M378 2331q141 -60 276.5 -311t151.5 -835v-1185h-210v1359q0 452 -112 682t-315 238v120q199 8 313 239t114 690v1359h210v-1185q0 -557 -142.5 -822t-285.5 -324v-25z",
  braceLeftTop:
    "M806 2548v-767q0 -824 133 -1219t426 -464v-95q-414 72 -591.5 492.5t-177.5 1251.5v801h210z",

  // #0-7 ccw
  braceRightBottom:
    "M596 0v767q0 824 -133 1219t-426 464v95q414 -72 591.5 -492.5t177.5 -1251.5v-801h-210z",
  braceRightMid:
    "M1024 2356q-143 59 -285.5 324t-142.5 822v1185h210v-1359q0 -459 114 -690t313 -239v-120q-203 -8 -315 -238t-112 -682v-1359h-210v1185q16 584 151.5 835t276.5 311v25z",
  braceRightTop:
    "M806 2545v-801q0 -831 -177.5 -1251.5t-591.5 -492.5v95q293 69 426 464t133 1219v767h210z",
};

class FigSimpleText extends Figure {
  constructor(public text: string) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  update(): void {}

  draw(offset: Point, surface: AbstractSurface): void {
    if (surface instanceof SvgSurface) {
      surface.addFigure(
        `<text x="${offset.x + this.org.x}" y="${
          offset.y + this.org.y
        }" font-size="50px" fill="blue">${this.text}</text>`
      );
    }
  }
}

it("bracketImgMaker", () => {
  const surface = createTestSurface();
  const frame = new FigFrame();
  const srcSegs = parsePath(g.braceRightMid); // <==
  const dstSegs: PathSeg[] = [];
  const points: { p: Point; n?: number }[] = [];
  let rc: Rect | undefined;
  const ptTest = (p: Point) => {
    rc = updateRect(p, rc);
  };
  const cvt = (p0: Point, n?: number) => {
    const p = rc ? new Point(p0.x - rc.left, p0.y - rc.top) : p0;
    points.push({ p, n });
    return p;
  };
  tracePath(srcSegs, {
    onM(p: Point): void {
      ptTest(p);
    },
    onL(p: Point): void {
      ptTest(p);
    },
    onC(cp1: Point, cp2: Point, p: Point): void {
      ptTest(cp1);
      ptTest(cp2);
      ptTest(p);
    },
    onQ(cp: Point, p: Point): void {
      ptTest(cp);
      ptTest(p);
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onZ() {},
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });
  let j = 0;
  tracePath(srcSegs, {
    onM(p: Point): void {
      dstSegs.push({ cmd: "M", pt: cvt(p, j++) });
    },
    onL(p: Point): void {
      dstSegs.push({ cmd: "L", pt: cvt(p, j++) });
    },
    onC(cp1: Point, cp2: Point, p: Point): void {
      dstSegs.push({ cmd: "C", pt: cvt(p, j++), cp1: cvt(cp1), cp2: cvt(cp2) });
    },
    onQ(cp: Point, p: Point): void {
      dstSegs.push({ cmd: "Q", pt: cvt(p, j++), cp: cvt(cp) });
    },
    onZ() {
      dstSegs.push({ cmd: "Z" });
    },
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });
  dstSegs.push({ cmd: "Z" });
  const fig = new FigPath(dstSegs, { fill: "black" });
  fig.update();
  frame.addFigure(fig, true);

  const L = 30;
  points.forEach(({ p, n }) => {
    const segs: PathSeg[] = [
      { cmd: "M", pt: p.minus(new Point(-L, -L)) },
      { cmd: "L", pt: p.minus(new Point(L, L)) },
      { cmd: "M", pt: p.minus(new Point(-L, L)) },
      { cmd: "L", pt: p.minus(new Point(L, -L)) },
    ];
    const cross = new FigPath(segs, {
      stroke: n ? "magenta" : "gray",
      strokeWidth: 5,
    });
    cross.update();
    frame.addFigure(cross, true);
    if (n) {
      const t = new FigSimpleText(String(n));
      t.org.set(p.x + L, p.y);
      frame.addFigure(t);
    }
  });
  const rcr = rc as unknown as Rect;
  let dstDataText = `{
    width: ${rcr.width},
    height: ${rcr.height},
    segs: [
`;
  const ln = (params: Record<string, string>): string =>
    `    {${Object.entries(params)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}},\n`;
  const spt = (p: Point): string => `new Point(${p.x}, ${p.y})`;
  tracePath(dstSegs, {
    onM(p: Point): void {
      dstDataText += ln({ cmd: `"M"`, pt: spt(p) });
    },
    onL(p: Point): void {
      dstDataText += ln({ cmd: `"L"`, pt: spt(p) });
    },
    onC(cp1: Point, cp2: Point, p: Point): void {
      dstDataText += ln({
        cmd: `"C"`,
        pt: spt(p),
        cp1: spt(cp1),
        cp2: spt(cp2),
      });
    },
    onQ(cp: Point, p: Point): void {
      dstDataText += ln({ cmd: `"Q"`, pt: spt(p), cp: spt(cp) });
    },
    onA(): void {
      throw new Error("Function not implemented.");
    },
  });
  dstDataText += "    ]\n}";
  const fileName = path.normalize(
    path.join(__dirname, "..", "..", "..", "rubbers", "figure.txt")
  );
  fs.writeFileSync(fileName, dstDataText);
  saveSurface("bracketImgMaker", frame, surface);
});
