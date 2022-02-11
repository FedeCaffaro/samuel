import { DEFAULT_ASSETS } from './constants';

export const getRandomDefaultAsset = () => DEFAULT_ASSETS.sort(() => 0.5 - Math.random())[0];
