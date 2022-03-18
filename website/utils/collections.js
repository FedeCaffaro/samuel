import { DROPS } from '../constants/drops';

export const mapCollectionFromService = ({ name, imageUrl, bannerImageUrl, stats }) => ({
  name,
  picture: imageUrl,
  banner: bannerImageUrl,
  stats
});

export const isValidCollectionPath = (collectionPath) =>
  DROPS.map(({ href }) => href).includes(collectionPath);
