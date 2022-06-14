/**
 * General rules are used from here:
 * https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#font-descriptions
 */

/*
                  __________________________________________
            ___###____________________________________     ^
  ####  ####  #   #                 ##                ^    |
   ##    ##   #                        _______        |    |
   ##    ##  ####     ##    ### ### ##       ^        |   accent
   ########   #     ##  ##   #  #    #       |   capHeight |
   ##    ##   #    ########   ##     #     xHeight    |    |
   ##    ##   #     ##       #  #    #       |        |    |
  ####  ####  #      ###   ### ###   #_______v________v____v
                                     #                     ^descent
                                   ##______________________v 
*/

export const enum BBoxIndex {
  left,
  bottom,
  right,
  top,
}
export type FontFaceBBox = [number, number, number, number];

export interface CommonFontFace {
  fontFamily: string; // "Roboto"
  fontWeight: string; // all | [normal | bold | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900] [, [normal | bold | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]]
  fontStyle?: string; // all | [ normal | italic | oblique ] [, [normal | italic | oblique] ]

  // all | [ normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded ] [, [ normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded] ]
  fontStretch?: string; // "normal"
  unitsPerEm?: number; // 2048
  panose1?: string; // "2 0 0 0 0 0 0 0 0 0"
  // Maximum unaccented height
  ascent: number; // 1536
  // Maximum unaccented depth
  descent: number; // -512
  // Height of lowercase glyphs
  xHeight: number; // 1082
  // height of uppercase glyphs of the font
  capHeight: number; // 1456
  // lower left x (left), lower left y (bottom), upper right x (right), and upper right y (top)
  bbox?: FontFaceBBox; // [-1488, -555, 2439, 2163]
  underlineThickness?: number; // 100
  underlinePosition?: number; // -200
  unicodeRange?: string; // "U+0002-FFFD"
}
