import cloneDeep from 'lodash.clonedeep';

export const isObject = (value) => typeof value === 'object';

export const isArray = (object) => object?.constructor?.name === 'Array';
export const inRange = (value, min, max) => min <= value && max >= value;
export const isNumber = (value) => typeof value === 'number';

const round = (number) => Math.round(number * 1000) / 1000;

const parseHexa = (string) => parseInt(string, 16);

const colorToArrayItem = (number) => round(number / 255);

const hexaColorRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const sourceMatchesObjColors = (source, obj, key, transform = (value) => value) =>
  source.every((color, index) => color === transform(obj[key][index]));

const isSComponent = (obj) => obj.s && isArray(obj.s) && obj.s.length === 4;

const isCKComponent = (obj) => !!obj.c?.k;

const replaceSComponent = (source, target, obj) => {
  if (sourceMatchesObjColors(source, obj, 's')) {
    obj.s = [...target, 1];
  }
};

const replaceCKComponent = (source, target, obj) => {
  if (isArray(obj.c.k) && !isNumber(obj.c.k[0])) {
    // eslint-disable-next-line no-use-before-define
    doReplace(source, target, obj.c.k);
  } else if (sourceMatchesObjColors(source, obj.c, 'k', (value) => round(value))) {
    obj.c.k = target;
  }
};

const doReplace = (sourceLottieColor, targetLottieColor, obj) => {
  if (isSComponent(obj)) {
    replaceSComponent(sourceLottieColor, targetLottieColor, obj);
  } else if (isCKComponent(obj)) {
    replaceCKComponent(sourceLottieColor, targetLottieColor, obj);
  } else {
    Object.keys(obj).forEach((key) => {
      if (isObject(obj[key])) {
        doReplace(sourceLottieColor, targetLottieColor, obj[key]);
      }
    });
  }
  return obj;
};

const convertColorIfValidates = (validation, conversion, errorMessage) => (color) => {
  if (validation(color)) {
    return conversion(color);
  }
  throw Error(errorMessage);
};

const convertHexaStringColor = convertColorIfValidates(
  (color) => !!color.match(hexaColorRegex),
  (color) =>
    hexaColorRegex
      .exec(color)
      .slice(1, 4)
      .map((aColor) => colorToArrayItem(parseHexa(aColor))),
  'The color provided is not in a correct hexa format. Format example: #AABBCC'
);

const convertArrayColor = convertColorIfValidates(
  (colorArray) => colorArray.length === 3 && colorArray.every((color) => inRange(color, 0, 255)),
  (colorArray) => colorArray.map((color) => round(color)),
  'The color provided is not in a correct array format. Format example: [10, 20, 30]'
);

const convertPerType = {
  string: convertHexaStringColor,
  Array: convertArrayColor
};

export const convertColorToLottieColor = (color) =>
  convertPerType[typeof color]?.(color) || convertPerType[color?.constructor?.name]?.(color);

export const replaceColor = (sourceColor, targetColor, lottieObj) => {
  const genSourceLottieColor = convertColorToLottieColor(sourceColor);
  const genTargetLottieColor = convertColorToLottieColor(targetColor);

  if (!genSourceLottieColor || !genTargetLottieColor) {
    throw new Error('Proper colors must be used for both source and target');
  }
  return doReplace(genSourceLottieColor, genTargetLottieColor, cloneDeep(lottieObj));
};
