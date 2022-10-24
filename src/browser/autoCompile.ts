import { WebFontCache } from "../drawSys/browser/WebFontCache";
import { AutoCompileConfig, DrawSysId, DrawSysIds } from "./AutoCompileConfig";
import { documentCompile } from "./documentCompile";

export const fontPropsCache = new WebFontCache();

export const autoCompile = () => {
  if (!document) return;
  const nodes = document.querySelectorAll(
    ".easyChemConfig,.CharChemConfig,body.echem-auto-compile"
  );
  if (nodes.length === 0) return;
  const cfgNode = nodes[nodes.length - 1]!;
  const cfg: AutoCompileConfig = {
    fontPropsCache,
  };

  const drawSys = cfgNode.getAttribute("data-drawsys");
  if (typeof drawSys === "string") {
    const drawSysId = drawSys.toLowerCase();
    if (drawSysId in DrawSysIds) {
      cfg.drawSysId = drawSysId as DrawSysId;
    }
  }

  const useText = cfgNode.getAttribute("data-usetext");
  if (typeof useText === "string") {
    const useTextLow = useText.toLowerCase();
    cfg.nonText = useTextLow === "no";
  }

  documentCompile(cfg);
};

export const addAutoCompileEvent = () => {
  window?.addEventListener("DOMContentLoaded", autoCompile);
};
