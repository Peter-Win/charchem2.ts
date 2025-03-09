import { splitPathChunks } from "../parsePath";

test("splitPathChunks", () => {
  expect(splitPathChunks("")).toEqual([]);
  expect(splitPathChunks("M12 34")).toEqual(["M", "12", "34"]);
  expect(splitPathChunks("M 12, -34")).toEqual(["M", "12", "-34"]);
  expect(splitPathChunks("M12 34L56 78")).toEqual([
    "M",
    "12",
    "34",
    "L",
    "56",
    "78",
  ]);
  expect(splitPathChunks("M12-34")).toEqual(["M", "12", "-34"]);
  expect(splitPathChunks("M-12-34")).toEqual(["M", "-12", "-34"]);
  expect(splitPathChunks("L-.123E-3-.8e-2")).toEqual([
    "L",
    "-.123E-3",
    "-.8e-2",
  ]);
  expect(splitPathChunks("0-13.2.8-15.5")).toEqual([
    "0",
    "-13.2",
    ".8",
    "-15.5",
  ]);
});
