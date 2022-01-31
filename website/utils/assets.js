const mapAssetFromService = ({ name, imageUrl, owner, lastSale }) => ({
  name,
  imageUrl,
  owner,
  lastSale
});

export const mapAssetsFromService = (assets) => assets.map(mapAssetFromService);
