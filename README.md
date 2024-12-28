# CharChem 2.0
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

System to describe the chemical formulas for WEB.

Official site: [http://charchem.org]

Full documentation on formula descriptions is located in the `/docs` folder of the repository or [here](http://charchem.org/docs/charchemdoc.html).

## Library for use in HTML

Please, see [documentation here](http://charchem.org/en/start).

If you want to build the library from the source code yourself, you will need [GIT](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download).
If you have this software on your computer, use the following commands:

```
git clone https://github.com/Peter-Win/charchem2.ts
cd charchem2.ts
npm i
npm run buildLib
```

The results will be in the `charchem2.ts/lib` folder

## Connecting a library to a project via NPM

This method allows you to use CharChem both in a browser and in a desktop (server) application.

Installation options:
- `npm i charchem2 -D`
- `yarn add charchem2 --dev`

All main features are collected in the file `src/ChemSys.ts`.

## Internationalization

Out of the box, 2 languages ​​are available: English (en) and Russian (ru).

In addition, there is an extended set, presented in the `internationalDict.json` file. However, this file is useful only for familiarization.

If you need to use an extended language set via the `script` tag, then it is recommended to use `charchem-lang.js`.
And if the npm library is used, then:

```
import {ChemSys} from "charchem2";
import {internationalDict} from  "charchem2/dist/internationalDict";
...
ChemSys.addDict(internationalDict);
```

If the extended set does not contain the language you need, you can fill in the necessary phrases yourself and connect them via `ChemSys.addDict`.

After the required dictionaries are registered, you can switch to the required language using the following code:

```
ChemSys.curLang = "en"; // Instead of "en", you can specify any of the registered locales.
```


## Miscellaneous

Problems:
- It is possible to insert unsafe code in HTML formula view by Text and Custom items.

