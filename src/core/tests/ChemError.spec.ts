import { ChemError } from "../ChemError";
import { Lang } from "../../lang/Lang";

it("ChemError", () => {
  Lang.curLang = "en";
  let err: ChemError | null = null;
  try {
    throw new ChemError("Unexpected '[C]'", { C: "?", pos: 11 });
  } catch (e) {
    if (e instanceof ChemError) err = e;
  }
  expect(err?.getMessage()).toBe("Unexpected '?'");
  Lang.curLang = "ru";
  expect(err?.getMessage()).toBe("Неверный символ '?' в позиции 11");
  expect(err?.getMessage("en")).toBe("Unexpected '?'");
});
