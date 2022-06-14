import { createLocalFontHash } from "../createLocalFontHash";

describe("createLocalFontHash", () => {
  const props = {
    family: "Arial",
    height: 20,
  };
  const stdHash = createLocalFontHash(props);

  it("negatives", () => {
    expect(createLocalFontHash({ ...props, weight: "bold" })).not.toBe(stdHash);
    expect(createLocalFontHash({ ...props, style: "italic" })).not.toBe(
      stdHash
    );
    expect(createLocalFontHash({ ...props, stretch: "condensed" })).not.toBe(
      stdHash
    );
    expect(createLocalFontHash({ ...props, height: 12 })).not.toBe(stdHash);
    expect(createLocalFontHash({ ...props, family: "Times" })).not.toBe(
      stdHash
    );
  });
  it("normal style and stretch", () => {
    expect(createLocalFontHash({ ...props, style: "normal" })).toBe(stdHash);
    expect(createLocalFontHash({ ...props, stretch: "normal" })).toBe(stdHash);
  });
  it("normal weight", () => {
    expect(createLocalFontHash({ ...props, weight: "normal" })).toBe(stdHash);
    expect(createLocalFontHash({ ...props, weight: "400" })).toBe(stdHash);
  });
  it("bold weight", () => {
    expect(createLocalFontHash({ ...props, weight: "bold" })).toBe(
      createLocalFontHash({ ...props, weight: "700" })
    );
  });
});
