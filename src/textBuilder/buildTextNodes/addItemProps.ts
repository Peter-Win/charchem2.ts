import { ChemNodeItem } from "../../core/ChemNodeItem";
import { TextNode } from "./TextNode";
import { locateAtomNumber } from "../../inspectors/locateAtomNumber";
import { ChemK } from "../../core/ChemK";
import { ifDef } from "../../utils/ifDef";

export const addItemProps = (
  obj: ChemNodeItem,
  addItem: (node: TextNode) => void
) => {
  const { color } = obj;
  if (obj.n.isSpecified())
    addItem({
      type: "k",
      k: obj.n,
      pos: "RB",
      kType: "item",
      color,
    });
  const rawAtomNum = obj.atomNum;
  let atomMass: number | undefined;
  if (typeof rawAtomNum === "number" || rawAtomNum === "") {
    // Вывести двухэтажную конструкцию: масса/атомный номер слева от элемента
    const atomNum = rawAtomNum === "" ? locateAtomNumber(obj) : rawAtomNum;
    atomMass = obj.mass ?? 0;
    if (atomNum !== undefined) {
      addItem({
        type: "k",
        k: new ChemK(atomNum),
        pos: "LB",
        kType: "atomNum",
        color,
      });
    }
  } else {
    atomMass = ifDef(obj.mass, (it) => it);
  }
  if (atomMass !== undefined)
    addItem({
      type: "k",
      k: new ChemK(atomMass),
      pos: "LT",
      kType: "mass",
      color,
    });

  if (obj.charge) {
    addItem({
      type: "charge",
      charge: obj.charge,
      color,
      pos: "T",
    });
  }
};
