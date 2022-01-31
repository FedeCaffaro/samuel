import { DROPS } from '../constants/drops';

export const mapCollectionFromService = ({ name, imageUrl, bannerImageUrl, stats }) => ({
  name,
  picture: imageUrl,
  banner: bannerImageUrl,
  stats
});

export const isValidCollectionPath = (collectionPath) => {
  const validPaths = DROPS.map(({ href }) => href);
  console.log(
    'validPaths',
    validPaths,
    collectionPath,
    typeof collectionPath,
    validPaths.includes(collectionPath)
  );
  return validPaths.includes(collectionPath);
};
