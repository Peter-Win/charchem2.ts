import { addClass } from "./addClass";

const className = "class";
class ElemStub {
  [className]: string | null;

  getAttribute(attr: string): string | null {
    return attr === className ? this[className] : null;
  }

  setAttribute(attr: string, value: string | null) {
    if (attr === className) this[className] = value;
  }

  constructor(cls?: string | null) {
    this[className] = cls ?? null;
  }
}
const createElemStub = (): Element => new ElemStub() as unknown as Element;

it("addClass", () => {
  const elem = createElemStub();
  expect(elem.getAttribute(className)).toBeNull();
  addClass(elem, "first");
  expect(elem.getAttribute(className)).toBe("first");
  addClass(elem, "second");
  expect(elem.getAttribute(className)).toBe("first second");
  addClass(elem, "first");
  expect(elem.getAttribute(className)).toBe("first second");
});
