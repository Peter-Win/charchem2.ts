import { Int } from "../../types";

export abstract class StackItem {
  constructor(public readonly pos: Int) {}

  abstract msgInvalidClose(): string;
}
