import { TextStyle } from "./TextStyle";

export interface TextChunk {
  styles?: TextStyle[];
  text: string;
}
