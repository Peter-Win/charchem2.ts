import { getVersionStr } from "../getVersion";

it("getVersionStr", () => {
  const ver = getVersionStr();
  expect(ver).toMatch(/^2\.\d+\.\d+$/);
});
