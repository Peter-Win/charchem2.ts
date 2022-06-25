export class Macros {
  constructor(public readonly name: string) {}

  body: string = "";
}

export const globalMacros: Record<string, Macros> = {};
