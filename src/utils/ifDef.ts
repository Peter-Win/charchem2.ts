export const ifDef = <IN, OUT>(
  value: IN | undefined,
  onDef: (v: IN) => OUT
): OUT | undefined => (value === undefined ? undefined : onDef(value));
