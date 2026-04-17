import { isSubStr } from "../isSubStr";
import { MarkupChunk, MarkupChunkItem, MarkupProps } from "./markup";
import { scanMarkupEnd } from "./scanMarkupEnd";

/* eslint no-loop-func: "off" */

type MarkupCmd = {
  start: string;
  exec: () => void;
};

export const parseMarkupChunk = (text: string): MarkupChunk => ({
  chunks: parseMarkup(text),
});

/**
 * Для HTML-отображения нужно указывать только те параметры, которые определены для каждого узла (локальные свойства).
 * Например: <span font-size="120%"><i>hello!</i></span>
 * А для structBuilder каждый узел должен содержать весь набор описывающих его параметров (глобальные свойства).
 * parseMarkup возвращает локальные свойства.
 * Для получения глобальных свойств нужно полученный результат пропустить через globalizeMarkupChunk.
 */
export const parseMarkup = (text: string): MarkupChunkItem[] => {
  let pos = 0;
  let prevPos = 0;
  let curProps: MarkupProps | undefined;
  const resChunks: MarkupChunkItem[] = [];

  const updateLeftText = (lastPos: number) => {
    if (lastPos > prevPos) {
      const leftText = text.slice(prevPos, lastPos);
      if (!curProps) {
        resChunks.push(leftText);
      } else {
        resChunks.push({
          props: { ...curProps },
          chunks: [leftText],
        });
      }
    }
  };

  const doCommand = (size: number, props: MarkupProps) => {
    resChunks.push({
      chunks: parseMarkup(text.slice(pos, pos + size)),
      props: { ...curProps, ...props },
    });
    pos += size;
  };

  const onCommand = (props: MarkupProps) => {
    const endPos = scanMarkupEnd(text, pos, "}");
    doCommand(endPos - pos - 1, props);
    pos = endPos;
  };

  const onCommandWithParam = (makeProps: (value: string) => MarkupProps) => {
    const paramEndPos = scanMarkupEnd(text, pos, "}");
    const paramValue = text.slice(pos, paramEndPos - 1).trim();
    pos = paramEndPos;
    onCommand(makeProps(paramValue));
  };

  const changeCurProps = (makeProps: (value: string) => MarkupProps) => {
    const endPos = scanMarkupEnd(text, pos, "}");
    const newProps = makeProps(text.slice(pos, endPos - 1));
    curProps = curProps ? { ...curProps, ...newProps } : newProps;
    pos = endPos;
  };

  const commands: MarkupCmd[] = [
    {
      start: "^{",
      exec: () => onCommand({ type: "sup" }),
    },
    {
      start: "^",
      exec: () => doCommand(1, { type: "sup" }),
    },
    {
      start: "_{",
      exec: () => onCommand({ type: "sub" }),
    },
    {
      start: "_",
      exec: () => doCommand(1, { type: "sub" }),
    },
    {
      start: "\\color{",
      exec: () => changeCurProps((color) => ({ color })),
    },
    {
      start: "{\\color{",
      exec: () => onCommandWithParam((color) => ({ color })),
    },
    {
      start: "{\\fontsize{",
      exec: () => onCommandWithParam((value) => ({ fontSizePt: +value })),
    },
    ...Object.entries(sizesMap).map(([name, fontSizePt]) => ({
      start: `\\${name}{`,
      exec: () => onCommand({ fontSizePt }),
    })),
    ...Object.entries(sizesMap).map(([name, fontSizePt]) => ({
      start: `{\\${name} `,
      exec: () => onCommand({ fontSizePt }),
    })),
    {
      start: "\\textbf{",
      exec: () => onCommand({ bold: true }),
    },
    {
      start: "{\\textbf ",
      exec: () => onCommand({ bold: true }),
    },
    {
      start: "\\textit{",
      exec: () => onCommand({ italic: true }),
    },
    {
      start: "{\\textit ",
      exec: () => onCommand({ italic: true }),
    },
    {
      start: "\\underline{",
      exec: () => onCommand({ underline: true }),
    },
    {
      start: "{\\underline ",
      exec: () => onCommand({ underline: true }),
    },
    {
      start: "\\overline{",
      exec: () => onCommand({ overline: true }),
    },
    {
      start: "{\\overline ",
      exec: () => onCommand({ overline: true }),
    },
  ];

  while (pos < text.length) {
    const cmd = commands.find(({ start }) => isSubStr(text, pos, start));
    if (!cmd) {
      pos++;
      continue;
    }
    updateLeftText(pos);
    pos += cmd.start.length;
    cmd.exec();
    prevPos = pos;
  }
  updateLeftText(pos);
  return resChunks;
};

// https://www.latex-project.org/help/documentation/fntguide.pdf
const sizesMap: Record<string, number> = {
  tiny: 5,
  scriptsize: 7,
  footnotesize: 8,
  small: 9,
  normalsize: 10,
  large: 12,
  Large: 14.4,
  LARGE: 17.28,
  huge: 20.74,
  Huge: 24.88,
};
