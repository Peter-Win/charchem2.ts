import { Int } from "../types";
import { ChemAgent } from "../core/ChemAgent";
import { SrcMapItem, getSrcItemsForObject } from "../compiler/sourceMap";

export const makeSourceWithNewCoeffs = (
  coeffs: Int[],
  agents: ChemAgent[],
  oldSrc: string,
  srcMap: SrcMapItem[]
): string => {
  const chunks: string[] = [];
  let prevPos = 0;
  agents.forEach((agent, agentIndex) => {
    const agentItems = getSrcItemsForObject(agent, srcMap);
    const itemsCount = agentItems.length;
    // Нужно учитывать возможные неудачные результаты
    if (itemsCount) {
      const leftPos = agentItems[0]!.begin;
      // const rightPos = agentItems[itemsCount-1]!.end;
      // Текст левее агента
      chunks.push(oldSrc.slice(prevPos, leftPos));
      prevPos = leftPos;
      // Текст нового коэффициента
      const k = coeffs[agentIndex];
      if (k !== undefined && k !== 1) {
        chunks.push(String(k));
      }
      // текст агента без коэффициента
      if (itemsCount > 1 && agentItems[0]!.part === "agentK") {
        prevPos = agentItems[1]!.begin;
      }
    }
  });
  chunks.push(oldSrc.slice(prevPos));
  return chunks.join("").trim();
};
