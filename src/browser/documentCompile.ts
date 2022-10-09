import { delay } from "../utils/delay";
import { AutoCompileConfig } from "./AutoCompileConfig";
import { renderFormulaCfg } from "./renderFormulaCfg";

export const documentCompile = async (
  config: AutoCompileConfig
): Promise<void> => {
  if (!document) return Promise.reject(new Error("Document expected"));
  try {
    const selector = config.formulaSelector ?? ".echem-formula";
    const list = document.querySelectorAll(selector);
    // Тут могут быть разные реализации. Например, webworker или lazy-view
    // Но пока просто делаем перерыв после каждой отрисовки, чтобы браузер мог получать управление между ними
    // не подходит queueMicrotask. Нужно создавать макрозадачу
    let i = 0;
    let elem = list[i++];
    while (elem) {
      elementCompile(elem, config);
      elem = list[i++];
      // eslint-disable-next-line no-await-in-loop
      await delay(1);
    }
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve();
};

export const elementCompile = (elem: Element, config: AutoCompileConfig) => {
  // @ts-ignore
  const code = elem.textContent ?? elem.innerText;
  renderFormulaCfg(elem, code, config);
};
