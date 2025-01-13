import { Matrix2x3 } from "../../math/Matrix2x3";
import { addAll } from "../../utils/addAll";
import { Point } from "../../math/Point";
import { is0 } from "../../math";
import {
  AbstractSurface,
  LocalFont,
  ParamsDrawGlyph,
  PathStyle,
} from "../AbstractSurface";
import { PathSeg } from "../path";
import { path2ps } from "./path2ps";
import { getVersionStr } from "../../getVersion";
import { style2ps } from "./style2ps";
import { ellipsePath } from "../utils/ellipsePath";

export class PsSurface implements AbstractSurface {
  protected prolog: string[] = [];

  addPrologLine(line: string) {
    this.prolog.push(line);
  }

  protected body: string[] = [];

  addCmdLine(line: string) {
    this.body.push(line);
  }

  addCmdLines(lines: string[]) {
    addAll(this.body, lines);
  }

  exportText(eol: string = "\n"): string {
    return [...this.prolog, ...this.body].join(eol);
  }

  addCreator() {
    this.addPrologLine(`%%Creator: CharChem v.${getVersionStr()}`);
  }

  addTitle(title: string | undefined) {
    if (title) {
      this.addPrologLine(`%%Title: ${title}`);
    }
  }

  protected size: Point = new Point();

  setSize(size: Point) {
    this.size.setPt(size);
  }

  drawPath(org: Point | Matrix2x3, path: PathSeg[], style: PathStyle) {
    this.graphicsStateBlock(() => {
      if (org instanceof Point) {
        this.addCmdLine(`${org.x} ${org.y} translate`);
      } else {
        this.addCmdLine(`[${org.repr()}] concat`);
      }
      this.addCmdLines(path2ps(path));
      this.addCmdLines(style2ps(style));
    });
  }

  drawEllipse(offset: Point, center: Point, radius: Point, style: PathStyle) {
    if (radius.x === 0) return;
    if (is0(radius.x - radius.y)) {
      this.graphicsStateBlock(() => {
        const c0 = center.plus(offset);
        this.addCmdLine(`${c0.x} ${c0.y} ${radius.x} 0 360 arc`);
        this.addCmdLines(style2ps(style));
      });
    } else {
      // Была попытка использовать scale, но оно влияет на толщину линии.
      this.drawPath(offset, ellipsePath(center, radius), style);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getFont(): LocalFont {
    throw Error("getFont not implemeted for PsSurface");
  }

  graphicsStateBlock(internal: () => void) {
    this.addCmdLine("gsave");
    internal();
    this.addCmdLine("grestore");
  }

  drawGlyph({ transform, getPath, style, glyphId }: ParamsDrawGlyph): void {
    const cmd = `draw_${glyphId}`;
    if (!this.glyphsSet.has(cmd)) {
      this.glyphsSet.add(cmd);
      this.addCmdLine(`/${cmd} {`);
      this.addCmdLines(path2ps(getPath()));
      this.addCmdLine("} def");
    }

    this.graphicsStateBlock(() => {
      this.addCmdLine(`[${transform.repr()}] concat`);
      this.addCmdLine(cmd);
      this.addCmdLines(style2ps(style));
    });
  }

  protected glyphsSet = new Set<string>();
}
