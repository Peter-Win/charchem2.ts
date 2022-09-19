import { AutoCompileConfig } from "./AutoCompileConfig";
import { renderFormulaCfg } from "./renderFormulaCfg";

export const documentCompile = (config: AutoCompileConfig) => {
  if (!document) return;
  const selector = config.formulaSelector ?? ".echem-formula";
  const list = document.querySelectorAll(selector);
  // Тут могут быть разные реализации. Например, webworker или lazy-view
  // Но пока просто делаем перерыв после каждой отрисовки, чтобы браузер мог получать управление между ними
  // не подходит queueMicrotask. Нужно создавать макрозадачу
  let i = 0;
  const id = setInterval(() => {
    const elem = list[i++];
    if (!elem) {
      clearInterval(id);
    } else {
      elementCompile(elem, config);
    }
  }, 2);
};

export const elementCompile = (elem: Element, config: AutoCompileConfig) => {
  // @ts-ignore
  const code = elem.textContent ?? elem.innerText;
  renderFormulaCfg(elem, code, config);
};
