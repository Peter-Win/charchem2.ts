import { addAll } from "./addAll";
import { isSubStr } from "./isSubStr";

/**
 * Markup commands
 * \color{...}
 * {\color{...}...}
 * ^. or ^{...}
 * _. or _{...}
 */
export type MarkupChunkType = "sub" | "sup" | "";

export interface MarkupChunk {
    type: MarkupChunkType;
    color?: string;
    chunks: (MarkupChunk | string)[];
}

export const scanMarkupEnd = (text: string, start: number, stopper: string): number => {
    let level = 0;
    let pos = start;
    while (pos < text.length) {
        const ch = text[pos++];
        if (ch === stopper && level <= 0) break;
        if (ch === "{") level++;
        else if (ch === "}") level--;
    }
    return pos;
}

export const parseMarkup = (text: string, topType: MarkupChunkType = "", topColor?: string): MarkupChunk => {
    const chunks: (MarkupChunk | string)[] = [];
    let pos = 0;
    let prevPos = 0;
    let color = topColor;
    const updateLeftText = (lastPos: number) => {
        if (lastPos > prevPos) {
            const chunkText = text.slice(prevPos, lastPos);
            chunks.push(color === topColor ? chunkText : {
                type: "",
                color,
                chunks: [chunkText]
            });
        }
    }
    const addChunk = (newType: MarkupChunkType) => {
        if (pos === text.length) return;
        updateLeftText(pos-1);
        const nextCh = text[pos++]!;
        if (nextCh === "{") {
            prevPos = pos;
            pos = scanMarkupEnd(text, pos, "}");
            const nested = parseMarkup(text.slice(prevPos, pos-1), newType);
            chunks.push(nested);
        } else {
            chunks.push({type: newType, chunks: [nextCh] })
        }
        prevPos = pos;
    }
    const getColor = (start: number): string | undefined => {
        const stop = text.indexOf("}", start);
        let newColor: string | undefined;
        if (stop < 0) {
            pos = start;
            newColor = undefined;
        } else {
            newColor = text.slice(start, stop);
            pos = stop + 1;
        }
        prevPos = pos;
        return newColor;
    }
    while (pos < text.length) {
        const ch = text[pos++];
        if (ch==="^") {
            addChunk("sup");
        } else if (ch==="_") {
            addChunk("sub");
        } else if (ch==="\\" && isSubStr(text, pos, "color{")) {
            // color for right text
            updateLeftText(pos-1);
            const newColor = getColor(pos + 6);
            if (newColor) color = newColor;
        } else if (ch==="{" && isSubStr(text, pos, "\\color{")) {
            // limited text
            updateLeftText(pos-1);
            const newColor = getColor(pos + 7);
            pos = scanMarkupEnd(text, pos, "}");
            chunks.push(parseMarkup(text.slice(prevPos, pos-1), "", newColor));
            prevPos = pos;
        }
    }
    updateLeftText(pos);
    const res: MarkupChunk = {type: topType, chunks};
    if (topColor) res.color = topColor;
    return res;
}

export interface ParamsMarkupFlat {
    phase: "open" | "close" | "full";
    chunk: MarkupChunk | string;
    owner: MarkupChunk;
}
export const markupFlat = (m: MarkupChunk, onChunk: (params: ParamsMarkupFlat) => void): void => {
    m.chunks.forEach(chunk => {
        if (typeof chunk === "string") {
            onChunk({phase: "full", chunk, owner: m});
        } else {
            onChunk({phase: "open", chunk, owner: m});
            markupFlat(chunk, onChunk);
            onChunk({phase: "close", chunk, owner: m});
        }
    });
}
