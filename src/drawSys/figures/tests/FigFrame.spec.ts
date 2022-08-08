import { Rect } from "../../../math/Rect";
import { FigFrame } from "../FigFrame";

describe("FigFrame", () => {
  it("update", () => {
    const owner = new FigFrame();
    owner.update();
    expect(owner.bounds.toString()).toBe("{0, 0, 0, 0}");

    const item1 = new FigFrame();
    item1.bounds = new Rect(0, 0, 10, 10);
    owner.addFigure(item1);
    owner.update();
    expect(owner.bounds.toString()).toBe("{0, 0, 10, 10}");

    const item2 = new FigFrame();
    item2.bounds = new Rect(0, 0, 11, 10);
    owner.addFigure(item2);
    owner.update();
    expect(owner.bounds.toString()).toBe("{0, 0, 11, 10}");

    item1.org.add(0, 5);
    owner.update();
    expect(owner.bounds.toString()).toBe("{0, 0, 11, 15}");
  });
});
