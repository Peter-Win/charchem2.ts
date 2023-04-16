import {
  makeMultiplicativePrefix,
  makeMultiplicativePrefixAsm,
  makeMultiplicativePrefixKis,
  trNumChunks,
} from "./makeMultiplicativePrefix";
import { updateNomenclatureDict } from "./updateNomenclatureDict";

const en = (n: number) => trNumChunks(makeMultiplicativePrefix(n), "en");
const ru = (n: number) => trNumChunks(makeMultiplicativePrefix(n), "ru");
const all = (n: number) => [en(n), ru(n)];

describe("makeMultiplicativePrefix", () => {
  updateNomenclatureDict();
  it("main cases", () => {
    expect(all(1)).toEqual(["mono", "моно"]);
    expect(all(2)).toEqual(["di", "ди"]);
    expect(all(3)).toEqual(["tri", "три"]);
    expect(all(4)).toEqual(["tetra", "тетра"]);
    expect(all(5)).toEqual(["penta", "пента"]);
    expect(all(6)).toEqual(["hexa", "гекса"]);
    expect(all(7)).toEqual(["hepta", "гепта"]);
    expect(all(8)).toEqual(["octa", "окта"]);
    expect(all(9)).toEqual(["nona", "нона"]);
    expect(all(10)).toEqual(["deca", "дека"]);
    expect(all(11)).toEqual(["undeca", "ундека"]);
    expect(all(12)).toEqual(["dodeca", "додека"]);
    expect(all(13)).toEqual(["trideca", "тридека"]);
    expect(all(14)).toEqual(["tetradeca", "тетрадека"]);
  });
  it("complex cases", () => {
    expect(all(486)).toEqual([
      "hexaoctacontatetracta",
      "гексаоктаконтатетракта",
    ]);
    expect(all(21)).toEqual(["henicosa", "генэйкоза"]);
    expect(all(22)).toEqual(["docosa", "докоза"]);
    expect(all(23)).toEqual(["tricosa", "трикоза"]);
    expect(all(24)).toEqual(["tetracosa", "тетракоза"]);
    expect(all(41)).toEqual(["hentetraconta", "гентетраконта"]);
    expect(all(52)).toEqual(["dopentaconta", "допентаконта"]);
    expect(all(111)).toEqual(["undecahecta", "ундекагекта"]);
    expect(all(363)).toEqual(["trihexacontatricta", "тригексаконтатрикта"]);
    expect(all(50)).toEqual(["pentaconta", "пентаконта"]);
    expect(all(100)).toEqual(["hecta", "гекта"]);
    expect(all(101)).toEqual(["henhecta", "генгекта"]);
    expect(all(600)).toEqual(["hexacta", "гексакта"]);
    expect(all(1000)).toEqual(["kilia", "килия"]);
    expect(all(2000)).toEqual(["dilia", "дилия"]);
    expect(all(9000)).toEqual(["nonalia", "ноналия"]);
  });
  it("errors", () => {
    expect(() => makeMultiplicativePrefix(0)).toThrow();
    expect(() => makeMultiplicativePrefix(-1)).toThrow();
    expect(() => makeMultiplicativePrefix(9999)).not.toThrow();
    expect(() => makeMultiplicativePrefix(10000)).toThrow();
  });
});

test("makeMultiplicativePrefixKis", () => {
  updateNomenclatureDict();
  const allKis = (n: number) =>
    ["en", "ru"].map((lang) =>
      trNumChunks(makeMultiplicativePrefixKis(n), lang)
    );
  expect(allKis(2)).toEqual(["bis", "бис"]);
  expect(allKis(3)).toEqual(["tris", "трис"]);
  expect(allKis(4)).toEqual(["tetrakis", "тетракис"]);
  expect(allKis(231)).toEqual(["hentriacontadictakis", "гентриаконтадиктакис"]);
});

test("makeMultiplicativePrefixAsm", () => {
  updateNomenclatureDict();
  const enAsm = (n: number) =>
    trNumChunks(makeMultiplicativePrefixAsm(n), "en");
  expect(enAsm(2)).toEqual("bis");
  expect(enAsm(5)).toEqual("quinque");
  expect(enAsm(6)).toEqual("sexi");
  expect(enAsm(10)).toEqual("deci");
  expect(enAsm(11)).toEqual("undeci");
  expect(enAsm(16)).toEqual("hexadeci");
  expect(enAsm(40)).toEqual("tetraconti");
});
