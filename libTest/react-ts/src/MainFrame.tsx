import * as React from "react";
import { CharChemDemo } from "src/components/CharChemDemo";
import { getVersionStr } from "charchem2/getVersion";

export const MainFrame: React.FC = () => (
  <div className="main-frame">
    <header>CharChem + React + TypeScript demo</header>
    <main>
      <CharChemDemo />
    </main>
    <footer>CharChem version: {getVersionStr()}</footer>
  </div>
);
