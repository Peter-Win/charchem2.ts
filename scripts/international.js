/**
 * Generate onternationalDict.ts from json
 */

const fs = require("node:fs");
const path = require("node:path");

const srcJsonName = path.resolve(__dirname, "..", "static", "internationalDict.json");
const dstTsName = path.resolve(__dirname, "..", "src", "internationalDict.ts");

const jsonText = fs.readFileSync(srcJsonName, {encoding: "utf-8"});

const tsText = 
`/**
 * This file was generated automatically from static/internationalDict.json.
 * Therefore, there is no need to try to edit it.
 */

import { LocalDict } from "./lang/LangTypes";

export const internationalDict: Record<string, LocalDict> = ${jsonText};`

fs.writeFileSync(dstTsName, tsText, {encoding: "utf-8"});