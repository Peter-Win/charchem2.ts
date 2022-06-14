import { XmlAttrs } from "./xmlTypes";
import { unescapeXml } from "./unescapeXml";

/**
 * Here, the features of svg fonts are taken into account.
 * All information in them is transmitted through tag attributes.
 * Therefore, texts inside tags and closing tags are ignored.
 * @param xmlText
 * @param onTag
 */
export const lightXmlParser = (
  xmlText: string,
  onTag: (tag: string, attrs: XmlAttrs) => void
) => {
  let pos = 0;
  type State =
    | "begin"
    | "startTag"
    | "skipTag"
    | "findAttr"
    | "attrName"
    | "findEq"
    | "findValue"
    | "attrValue";
  let state: State = "begin";
  let tag = "";
  let attrs: XmlAttrs = {};
  let name = "";
  let value: string | null = null;
  const updateAttrs = () => {
    if (name && value !== null) {
      const n = value.length;
      if (n > 1 && value[0] === '"' && value[n - 1] === '"')
        value = value.slice(1, -1);
      attrs[name] = unescapeXml(value);
      name = "";
      value = null;
    }
  };
  const updateTag = () => {
    if (tag) {
      updateAttrs();
      onTag(tag, attrs);
      tag = "";
      attrs = {};
      state = "begin";
    }
  };
  const dispatcher: Record<State, (c: string) => void> = {
    begin: (c) => {
      if (c === "<") state = "startTag";
    },
    startTag: (c) => {
      if (c === ">") {
        // case: <tag*>
        updateTag();
      } else if (c === "/") {
        // cases: <*/tag> or <tag*/>
        if (tag) {
          updateTag();
        } else {
          state = "skipTag";
        }
      } else if (/\s/.test(c)) {
        // case: <tag* attr...
        state = "findAttr";
      } else {
        tag += c;
      }
    },
    skipTag: (c) => {
      if (c === ">") state = "begin";
    },
    findAttr: (c) => {
      if (c === ">" || c === "/") {
        // <tag attr="value"*> or <tag */>
        updateTag();
      } else if (!/\s/.test(c)) {
        name = c;
        state = "attrName";
      }
    },
    attrName: (c) => {
      if (/\s/.test(c)) {
        // <tag attr* attr...  or <tag attr* =
        state = "findEq";
      } else if (c !== "=") {
        name += c;
      } else {
        state = "findValue";
      }
    },
    findEq: (c) => {
      if (c === "=") {
        state = "findValue";
      } else if (c === "/" || c === ">") {
        updateTag();
      }
    },
    findValue: (c) => {
      if (c === '"') {
        value = c;
        state = "attrValue";
      } else if (!/\s/.test(c)) {
        // This wrong situation. Ignore this tag
        name = "";
        state = "skipTag";
      }
    },
    attrValue: (c) => {
      value += c;
      if (c === '"') {
        updateAttrs();
        state = "findAttr";
      }
    },
  };
  while (pos < xmlText.length) {
    // eslint-disable-next-line no-plusplus
    const c = xmlText[pos++];
    dispatcher[state]!(c!);
  }
};
