export type ColorSamples = {
  r: number; // range of all samples: [0;255]
  g: number;
  b: number;
  a?: number;
};

/*
NB: The interval from 0 to 255 is a conditional assumption. And it is accepted for convenience.
Objectively, this is not a limitation if we suddenly need to use 16-bit components.
Because the component values are not necessarily integers. And they can be scaled without noticeable losses.

It would be possible to use an interval from 0 to 1, as is done in many systems (e.g. in PostScript). 
But then there would be more errors in the bit grid when scaling. 
That is, instead of 255, we would get something like 254.9999999
Of course, this is not a serious argument, since such problems are easily solved. 
But since there is no fundamental difference, 255 was chosen based on personal preference.
*/

/*
TODO: Довольно долго графические формулы выводились только в браузере.
Затем появился переносимый формат SVG.
В этих случаях вполне достаточно цветовой модели RGB.
Однако по мере появления других переносимых форматов (н.р. EPS) может потребоваться поддержка других цветовых моделей.
Хотя даже в CSS поддерживается модель HSL.
А в EPS можно использовать GrayScale и CMYK.

Но пока поддерживается только RGB.
В случае расширения можно превратить ColorSamples = ColorSamplesRgb | ColorSamplesCmyk ...
И добавиь соответствующий тип в Color
*/
