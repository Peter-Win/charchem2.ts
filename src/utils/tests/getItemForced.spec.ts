import { getItemForced } from "../getItemForced";

describe("getItemForced", () => {
  it("default value", () => {
    const dict: Record<string, string> = {};
    expect(getItemForced(dict, "1", "uno")).toBe("uno");
    expect(dict).toEqual({ "1": "uno" });
    // default value not used because this key already exists
    expect(getItemForced(dict, "1", "one")).toBe("uno");
    // dictionary is not changed
    expect(dict).toEqual({ "1": "uno" });
  });
  it("default function", () => {
    interface Struct {
      color: string;
      width: number;
    }
    const dict: Record<string, Struct> = {};
    expect(
      getItemForced(dict, "A", () => ({ color: "red", width: 2 }))
    ).toEqual({ color: "red", width: 2 });
    expect(dict).toEqual({ A: { color: "red", width: 2 } });
  });
});
