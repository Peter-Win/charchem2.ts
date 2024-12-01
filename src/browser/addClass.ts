export const addClass = (elem: Element, className: string) => {
  if (elem.classList) {
    elem.classList.add(className);
  } else {
    const cls: string | null = elem.getAttribute("class");
    const clsList: string[] = cls ? cls.split(" ") : [];
    const clsSet = new Set<string>(clsList);
    clsSet.add(className);
    elem.setAttribute("class", Array.from(clsSet).join(" "));
  }
};
