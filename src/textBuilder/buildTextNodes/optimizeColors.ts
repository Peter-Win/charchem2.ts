/* eslint no-param-reassign: "off" */
/* eslint prefer-destructuring: "off" */

export const optimizeColors = <T extends { color?: string }>(
  node: T,
  getList: (owner: T) => T[] | undefined
) => {
  const list = getList(node);
  if (!list) return;
  const { color: nodeColor } = node;
  list.forEach((it) => optimizeColors(it, getList));

  const subColors = new Set<string>();
  list.forEach((it) => subColors.add(it.color ?? ""));
  const aColors = Array.from(subColors).sort();
  if (aColors.length === 1 && aColors[0]) {
    // Если все подчинённые элементы имеют одинаковый и непустой цвет, то он становится цветом узла, а из элементов убирается
    node.color = aColors[0];
    list.forEach((it) => {
      delete it.color;
    });
  } else if (aColors.length === 2 && !aColors[0] && aColors[1] === node.color) {
    // Если одни подчиненные имеют такой же цвет, как узел, а у других цевет не указан, то просто убрать цвет у подчиненных
    list.forEach((it) => {
      delete it.color;
    });
  } else if (nodeColor && subColors.has(nodeColor)) {
    // Если есть элементы с таким же цветом как узел, то убрать цвет только у них
    list.forEach((it) => {
      if (it.color === nodeColor) {
        delete it.color;
      }
    });
  }
};
