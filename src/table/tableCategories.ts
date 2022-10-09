export type TCategories = Record<string, string>;

// Распределение элементов по цветовым группам
// по электронам
export const categoryBlock: TCategories = {
  s_block: "H,Na,K,Rb,Cs,Fr",
  p_block: "B,Al,Ga,In,Tl,Nh",
  d_block: "Sc,Y,Lu,Lr",
  f_block: "La,Ac",
};

// по свойствам
export const categoryProps: TCategories = {
  "Alkali-metals": "Li,Na,K,Rb,Cs,Fr",
  "Alkaline-earth-metals": "Be,Mg,Ca,Sr,Ba,Ra",
  Lanthanides: "La",
  Actinides: "Ac",
  "Transition-metals": "Sc,Y,Hf,Rf,Cn",
  "Post-transition-metals": "Al,Ga,In,Tl,Nh",
  Metalloids: "B,Si,Ge,Sb",
  "Other-nonmetals": "H,C,P,Se",
  Halogens: "F,Cl,Br,I,At,Ts",
  "Noble-gases": "He,Ne,Ar,Kr,Xe,Rn,Og",
  // 'Unknown-props': 'Mt'
};

export const subGroup = {
  subgr_a: "H,Ga,In,Tl",
  subgr_b: "Sc,Y,La,Ac",
};
