import { roundMass, strMass } from "../massUtils";

it("roundMass", () => {
  expect(roundMass(0)).toBe(0);
  expect(roundMass(1e-4)).toBe(0);
  expect(roundMass(0.1)).toBe(0.1);
  expect(roundMass(0.12)).toBe(0.12);
  expect(roundMass(0.123)).toBe(0.12);
  expect(roundMass(0.129)).toBe(0.13);
});

it("roundMass", () => {
  expect(strMass(0)).toBe("0");
  expect(strMass(1e-4)).toBe("0");
  expect(strMass(0.1)).toBe("0.1");
  expect(strMass(0.12)).toBe("0.12");
  expect(strMass(0.123)).toBe("0.12");
  expect(strMass(0.129)).toBe("0.13");
});
