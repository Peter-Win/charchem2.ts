# CharChem 2.0
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

System to describe the chemical formulas for WEB

Features of 2.0
- Braces by {{OH}}
- $padding() for brackets: $padding(0.1)[N<`|H><`/H><\H>]
- $background():  N<`|$background(orange,round)H><`/H><\H>
- extended markup in comments "H_4N^+"-->
- _(h+), _(h-)
- $pos() for charge position: \N$pos(-90)^+/O`/|O^-
- New operation arrow --|>

Problems:
- It is possible to insert unsafe code in HTML formula view by Text and Custom items.

