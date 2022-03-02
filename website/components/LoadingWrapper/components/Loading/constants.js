

import loading from './loading.json';
import loadingMenta from './loading-menta.json';
import { replaceColor } from './utils';

export const LOADING_TYPES = {
  BUTTON: 'button',

};

const DEFAULT_COLOR_PER_TYPE = {
  [LOADING_TYPES.BUTTON]: [0.016, 0.416, 0.816],

};

export const SPINNER_TYPES = {
  [LOADING_TYPES.BUTTON]: loading,

};

export const getOptions = ({ type, loop = true, autoplay = true, rendererSettings, color = '' }) => {
  const animationData = SPINNER_TYPES[type] || SPINNER_TYPES[LOADING_TYPES.MENTA];
  return {
    loop,
    autoplay,
    animationData: color
      ? replaceColor(DEFAULT_COLOR_PER_TYPE[type || LOADING_TYPES.MENTA], color, animationData)
      : animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      ...rendererSettings
    }
  };
};
