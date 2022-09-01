import fs from "fs";
import { ChemImgProps, TextProps } from "../../drawSys/ChemImgProps";
import { SvgFont } from "../../drawSys/portableFonts/svgFont/SvgFont";
import { AbstractSurface } from "../../drawSys/AbstractSurface";
import { SvgSurfacePortable } from "../../drawSys/svg/SvgSurfacePortable";
import { FigFrame } from "../../drawSys/figures/FigFrame";
import { renderTopFrame } from "../../drawSys/figures/renderTopFrame";
import { standaloneExportOptions } from "../../drawSys/svg/standaloneExportOptions";

export const createTestFontFactory = (): SvgFont => SvgFont.create(testFont);

export const createTestSurface = (fontFactory?: SvgFont): SvgSurfacePortable =>
  new SvgSurfacePortable(fontFactory ?? createTestFontFactory());

export const createTestStyle = (
  surface: AbstractSurface,
  height: number,
  fill = "black"
): TextProps => ({
  font: surface.getFont({ family: "", height }),
  style: { fill },
});

export const createTestImgProps = (
  surface: AbstractSurface,
  height: number,
  fill = "black"
) => {
  const imgProps = new ChemImgProps(createTestStyle(surface, height, fill));
  const smallStyle = createTestStyle(surface, height * 0.6, fill);
  imgProps.styles.itemCount = smallStyle;
  imgProps.styles.itemMass = smallStyle;
  imgProps.styles.nodeCharge = smallStyle;
  imgProps.styles.oxidationState = smallStyle;
  imgProps.init();
  return imgProps;
};

export const saveSurface = (
  shortFileName: string,
  frame: FigFrame,
  surface: SvgSurfacePortable
) => {
  frame.update();
  renderTopFrame(frame, surface);
  const svgText = surface.exportText(standaloneExportOptions);
  const fullName = `${__dirname}/images/${shortFileName}.svg`;
  // eslint-disable-next-line no-console
  fs.promises.writeFile(fullName, svgText).catch((e) => console.error(e));
};

const testFont = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
<defs>
<font id="HussarBoldWeb" horiz-adv-x="1406" >
  <font-face 
    font-family="Hussar"
    font-weight="700"
    font-stretch="normal"
    units-per-em="1000"
    panose-1="0 0 8 0 0 0 0 0 0 0"
    ascent="750"
    descent="-250"
    x-height="513"
    cap-height="825"
    bbox="-167 -351 1554.23 1227.39"
    underline-thickness="50"
    underline-position="-50"
    stemh="188"
    stemv="860"
    unicode-range="U+0020-10FFFD"
  />
<missing-glyph horiz-adv-x="500" d="M50 0v500h400v-500h-400zM100 50h300v400h-300v-400z" />
<glyph glyph-name="C" unicode="C" horiz-adv-x="753" 
 d="M499 170c96 0 162 51 162 51l80 -160s-92 -76 -271 -76c-233 0 -447 190 -447 426c0 237 213 429 447 429c179 0 271 -76 271 -76l-80 -160s-66 51 -162 51c-189 0 -272 -132 -272 -242c0 -111 83 -243 272 -243z" />
<glyph glyph-name="F" unicode="F" horiz-adv-x="567" 
 d="M537 825v-165h-289v-164h267v-165h-267v-331h-188v825h477z" />
<glyph glyph-name="H" unicode="H" horiz-adv-x="762" 
 d="M248 331v-331h-188v825h188v-329h266v329h188v-825h-188v331h-266z" />
<glyph glyph-name="I" unicode="I" horiz-adv-x="308" 
 d="M248 825v-825h-188v825h188z" />
<glyph glyph-name="N" unicode="N" horiz-adv-x="826" 
  d="M248 512v-512h-188v825h188l328 -512h2v512h188v-825h-188l-328 512h-2z" />
<glyph glyph-name="O" unicode="O" horiz-adv-x="877" 
 d="M23 413c0 241 189 427 416 427c229 0 415 -186 415 -427s-178 -428 -415 -428c-244 0 -416 187 -416 428zM226 413c0 -123 59 -246 213 -246c150 0 212 123 212 246s-66 246 -212 246c-145 0 -213 -123 -213 -246z" />

<glyph glyph-name="two" unicode="2" horiz-adv-x="753" 
 d="M363 681c-90 0 -147 -157 -147 -157l-157 76s80 240 304 240c283 0 320 -186 320 -290c0 -193 -291 -385 -291 -385h306v-165h-643v47s425 351 425 503c0 30 -7 131 -117 131z" />
<glyph glyph-name="three" unicode="3" horiz-adv-x="665" 
 d="M205 587l-148 72s42 181 273 181c157 0 271 -100 271 -240c0 -68 -28 -120 -73 -155c64 -39 105 -102 105 -189c0 -158 -129 -271 -306 -271c-254 0 -310 203 -310 203l174 85s11 -126 135 -126c69 0 119 39 119 109c0 71 -53 121 -119 121c-20 0 -36 -6 -36 -6v123h41
 c50 0 99 44 99 104c0 53 -49 91 -102 91c-104 0 -123 -102 -123 -102z" />
<glyph glyph-name="four" unicode="4" horiz-adv-x="812"
 d="M646 825v-486h96v-165h-96v-174h-176v174h-400v56l329 595h247zM470 574h-40l-109 -235h149v235z" /> 

<glyph glyph-name="parenleft" unicode="(" horiz-adv-x="403" 
 d="M345 -211l-115 -49s-175 211 -175 557c0 356 189 578 189 578l115 -49s-141 -171 -141 -529c0 -338 127 -508 127 -508z" />
<glyph glyph-name="parenright" unicode=")" horiz-adv-x="403" 
 d="M173 -260l-115 49s127 170 127 508c0 358 -141 529 -141 529l115 49s189 -222 189 -578c0 -346 -175 -557 -175 -557z" />
<glyph glyph-name="bracketleft" unicode="[" horiz-adv-x="442" d="M60 860h322v-117h-169v-886h169v-117h-322v1120z" />
<glyph glyph-name="bracketright" unicode="]" horiz-adv-x="442" d="M60 -143h169v886h-169v117h322v-1120h-322v117z" />
<glyph glyph-name="braceleft" unicode="{" horiz-adv-x="446" 
d="M60 253v94c43 0 70 19 70 65v267c0 83 31 181 159 181h97v-128h-40c-35 0 -63 -28 -63 -68v-257c0 -57 -27 -89 -61 -107c34 -18 61 -51 61 -107v-257c0 -40 28 -68 63 -68h40v-128h-97c-128 0 -159 98 -159 181v267c0 46 -27 65 -70 65z" />
    <glyph glyph-name="bar" unicode="|" horiz-adv-x="273" 
d="M60 0v860h153v-860h-153z" />
    <glyph glyph-name="braceright" unicode="}" horiz-adv-x="446" 
d="M386 347v-94c-43 0 -70 -19 -70 -65v-267c0 -83 -31 -181 -159 -181h-97v128h40c35 0 63 28 63 68v257c0 56 27 89 61 107c-34 18 -61 50 -61 107v257c0 40 -28 68 -63 68h-40v128h97c128 0 159 -98 159 -181v-267c0 -46 27 -65 70 -65z" />
 

<glyph glyph-name="plus" unicode="+" horiz-adv-x="633" 
 d="M393 158h-153v180h-180v153h180v180h153v-180h180v-153h-180v-180z" />
<glyph glyph-name="hyphen" unicode="-" horiz-adv-x="442" d="M60 366h322v-153h-322v153z" />
<glyph glyph-name="equal" unicode="=" horiz-adv-x="633" d="M60 611h513v-153h-513v153zM60 371h513v-153h-513v153z" />


<glyph glyph-name="f" unicode="f" horiz-adv-x="523" 
 d="M125 585v37c0 150 73 253 201 253c90 0 146 -46 146 -46l-62 -125s-24 14 -53 14c-45 0 -55 -30 -55 -101v-32h118v-135h-118v-450h-177v450h-74v135h74z" />
<glyph glyph-name="g" unicode="g" horiz-adv-x="683" 
 d="M37 -126l145 71c19 -31 62 -66 139 -66c49 0 125 29 125 120v38c-38 -42 -98 -52 -168 -52c-150 0 -255 121 -255 271s105 272 255 272c68 0 123 -22 165 -61h3v46h177v-527c0 -172 -127 -261 -302 -261c-107 0 -230 24 -284 149zM211 256c0 -70 48 -120 120 -120
 c69 0 119 50 119 120c0 71 -53 121 -119 121c-67 0 -120 -50 -120 -121z" />
<glyph glyph-name="l" unicode="l" horiz-adv-x="440" 
 d="M101.102 825h176.5l4 -585s0.0546875 -85.3467 57.3848 -95c57.6152 -17 50.959 -11.0068 48.1152 -30c0 0 -17.165 -114.712 -74.9463 -115c-32.0537 0 -75.7139 -2.2832 -87.0537 3c-82.8525 38.6025 -122.015 151.552 -121.521 237.024z" /> 
<glyph glyph-name="periodcentered" unicode="&#xb7;" horiz-adv-x="314" d="M72 339c0 48 39 88 85 88s85 -40 85 -88s-39 -88 -85 -88s-85 40 -85 88z" /> 
</defs>
</svg>
`;
