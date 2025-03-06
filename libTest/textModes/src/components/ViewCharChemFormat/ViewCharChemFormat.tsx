import * as React from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../store";
import { Feature, FeaturesList } from "../FeaturesList";
import { ChemSys } from "../../../../../src/ChemSys";

export const ViewCharChemFormat: React.FC = observer(() => {
  const {charChemCode} = store;
  const el = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (el.current) {
      ChemSys.draw(el.current, charChemCode, {nonText: false});
    }
  }, [charChemCode]);
  const features: Feature[] = [
    {
      name: "Source code",
      render: <code>{charChemCode}</code>,
    },
    {
      name: "Text mode view",
      render: <div style={store.formulaStyle} className="echem-formula" ref={el}>
      </div>,
    },
  ];
  
  return (
    <FeaturesList list={features} storageKey="featCharChem" />
  );
})