import { parseVerParameter } from "../funcVer";

it("parseVerParameter", () => {
  expect(parseVerParameter([""])).toEqual([0, 0]);
  expect(parseVerParameter(["1"])).toEqual([1, 0]);
  expect(parseVerParameter(["2.3"])).toEqual([2, 3]);
  expect(parseVerParameter(["1.2.3"])).toEqual([1, 2]);
  expect(parseVerParameter([" "])).toEqual([0, 0]);
  expect(parseVerParameter(["a"])).toEqual([0, 0]);
  expect(parseVerParameter(["a.b"])).toEqual([0, 0]);
  expect(parseVerParameter(["4.a"])).toEqual([4, 0]);
  expect(parseVerParameter(["a.5"])).toEqual([0, 5]);
  expect(parseVerParameter(["1", "2"])).toEqual([1, 2]);
});
