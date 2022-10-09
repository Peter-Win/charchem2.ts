import { PeriodicTable } from "../core/PeriodicTable";
import { ifDef } from "../utils/ifDef";
import { Lang } from "../lang/Lang";
import { TCategories } from "./tableCategories";

// Поиск категории для элемента
const GrpCache = new Map<TCategories, Record<string, string>>();

export const findCategory = (
  table: TCategories,
  item: string,
  locale?: string
) => {
  if (!GrpCache.has(table)) {
    const dict: Record<string, string> = {};
    GrpCache.set(table, dict);
    const revMap = Object.entries(table).reduce(
      (map, [categoryKey, pkList]) => {
        pkList.split(",").forEach((id) => {
          // eslint-disable-next-line no-param-reassign
          map[id] = categoryKey;
        });
        return map;
      },
      {} as Record<string, string>
    );
    let curCategory = "";
    PeriodicTable.elements.forEach(({ id }) => {
      ifDef(revMap[id], (it) => {
        curCategory = it;
      });
      dict[id] = curCategory;
    });
  }
  let cat = GrpCache.get(table)![item] ?? "";
  cat = cat.replace(/-/g, " ").replace(/_/g, "-");
  cat = Lang.tr(cat, {}, locale);
  return cat;
};
