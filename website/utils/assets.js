const mapAssetFromService = ({ name, imageUrl, owner, lastSale, tokenId }) => ({
  name,
  imageUrl,
  owner,
  lastSale,
  tokenId
});

export const mapAssetsFromService = (assets) => assets.map(mapAssetFromService);
