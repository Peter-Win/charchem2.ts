import { ChemAtom } from "./ChemAtom";
import { Double, Int } from "../types";
import { ElementId, IsotopeId } from "../types/ElementId";

type ElementMap = Record<ElementId, ChemAtom>;
let elementsCache: readonly ChemAtom[] | null = null;
let dictCache: ElementMap | null = null;
let isotopesCache: readonly ChemAtom[] | null = null;
let isotopeDictCache: Record<IsotopeId, ChemAtom> | null = null;

export const findElement = (id: string): ChemAtom | undefined =>
  PeriodicTable.dict[id as ElementId] ||
  PeriodicTable.isotopesDict[id as IsotopeId];

export const PeriodicTable = Object.freeze({
  get elements(): readonly ChemAtom[] {
    if (elementsCache) return elementsCache;
    const list = Object.freeze(
      (Object.keys(massMap) as ElementId[]).map(
        (id, index) =>
          new ChemAtom(index + 1, id, massMap[id][0], {
            epsilonMass: massMap[id][1],
          })
      )
    );
    elementsCache = list;
    return list;
  },
  get dict(): ElementMap {
    if (dictCache) return dictCache;
    const map = {} as ElementMap;
    this.elements.forEach((elem) => {
      map[elem.id as ElementId] = elem;
    });
    const finalMap = Object.freeze(map);
    dictCache = finalMap;
    return finalMap;
  },
  get isotopes(): readonly ChemAtom[] {
    if (isotopesCache) return isotopesCache;
    const list = Object.freeze(
      isotopesDef.map(
        ([n, id, mass, stable]) => new ChemAtom(n, id, mass, { stable })
      )
    );
    isotopesCache = list;
    return list;
  },
  get isotopesDict(): Record<IsotopeId, ChemAtom> {
    if (isotopeDictCache) return isotopeDictCache;
    const map = {} as Record<IsotopeId, ChemAtom>;
    this.isotopes.forEach((elem) => {
      map[elem.id as IsotopeId] = elem;
    });
    const finalMap = Object.freeze(map);
    isotopeDictCache = finalMap;
    return finalMap;
  },
});

// Main source:  Table 1 / Abridged standard atomic weight
// from https://www.degruyter.com/document/doi/10.1515/pac-2019-0603/html
// and for Elements without stable isotopes: Table 2 from https://iupac.qmul.ac.uk/AtWt/
const massMap: Record<ElementId, [Double, Double] | [Double]> = {
  H: [1.008, 0.0002],
  He: [4.0026, 0.0001],
  Li: [6.94, 0.06],
  Be: [9.0122, 0.0001],
  B: [10.81, 0.02],
  C: [12.011, 0.002],
  N: [14.007, 0.001],
  O: [15.999, 0.001],
  F: [18.998, 0.001],
  Ne: [20.18, 0.001],
  Na: [22.99, 0.001],
  Mg: [24.305, 0.002],
  Al: [26.982, 0.001],
  Si: [28.085, 0.001],
  P: [30.974, 0.001],
  S: [32.06, 0.02],
  Cl: [35.45, 0.01],
  Ar: [39.95, 0.16],
  K: [39.098, 0.001],
  Ca: [40.078, 0.004],
  Sc: [44.956, 0.001],
  Ti: [47.867, 0.001],
  V: [50.942, 0.001],
  Cr: [51.996, 0.001],
  Mn: [54.938, 0.001],
  Fe: [55.845, 0.002],
  Co: [58.933, 0.001],
  Ni: [58.693, 0.001],
  Cu: [63.546, 0.003],
  Zn: [65.38, 0.02],
  Ga: [69.723, 0.001],
  Ge: [72.63, 0.008],
  As: [74.922, 0.001],
  Se: [78.971, 0.008],
  Br: [79.904, 0.003],
  Kr: [83.798, 0.002],
  Rb: [85.468, 0.001],
  Sr: [87.62, 0.01],
  Y: [88.906, 0.001],
  Zr: [91.224, 0.002],
  Nb: [92.906, 0.001],
  Mo: [95.95, 0.01],
  Tc: [97],
  Ru: [101.07, 0.02],
  Rh: [102.91, 0.01],
  Pd: [106.42, 0.01],
  Ag: [107.87, 0.01],
  Cd: [112.41, 0.01],
  In: [114.82, 0.01],
  Sn: [118.71, 0.01],
  Sb: [121.76, 0.01],
  Te: [127.6, 0.03],
  I: [126.9, 0.01],
  Xe: [131.29, 0.01],
  Cs: [132.91, 0.01],
  Ba: [137.33, 0.01],
  La: [138.91, 0.01],
  Ce: [140.12, 0.01],
  Pr: [140.91, 0.01],
  Nd: [144.24, 0.01],
  Pm: [145],
  Sm: [150.36, 0.02],
  Eu: [151.96, 0.01],
  Gd: [157.25, 0.03],
  Tb: [158.93, 0.01],
  Dy: [162.5, 0.01],
  Ho: [164.93, 0.01],
  Er: [167.26, 0.01],
  Tm: [168.93, 0.01],
  Yb: [173.05, 0.02],
  Lu: [174.97, 0.01],
  Hf: [178.49, 0.01],
  Ta: [180.95, 0.01],
  W: [183.84, 0.01],
  Re: [186.21, 0.01],
  Os: [190.23, 0.03],
  Ir: [192.22, 0.01],
  Pt: [195.08, 0.02],
  Au: [196.97, 0.01],
  Hg: [200.59, 0.01],
  Tl: [204.38, 0.01],
  Pb: [207.2, 1.1],
  Bi: [208.98, 0.01],
  Po: [209],
  At: [210],
  Rn: [222],
  Fr: [223],
  Ra: [226],
  Ac: [227],
  Th: [232.04, 0.01],
  Pa: [231.04, 0.01],
  U: [238.03, 0.01],
  Np: [237],
  Pu: [244],
  Am: [243],
  Cm: [247],
  Bk: [247],
  Cf: [251],
  Es: [252],
  Fm: [257],
  Md: [258],
  No: [259],
  Lr: [262],
  Rf: [267],
  Db: [270],
  Sg: [269],
  Bh: [270],
  Hs: [270],
  Mt: [278],
  Ds: [281],
  Rg: [281],
  Cn: [285],
  Nh: [286],
  Fl: [289],
  Mc: [289],
  Lv: [293],
  Ts: [294],
  Og: [294],
};

const isotopesDef: [Int, IsotopeId, Double, boolean][] = [
  [1, "D", 2.014101777844, true],
  [1, "T", 3.01604928132, false],
];
