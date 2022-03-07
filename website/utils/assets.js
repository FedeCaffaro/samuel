const mapAssetFromService = ({ name, imageUrl, owner, lastSale, tokenId }) => ({
  name,
  imageUrl,
  owner,
  lastSale,
  tokenId
});

export const mapAssetsFromService = (assets) => assets.map(mapAssetFromService);

export const getTokenIdsAsParams = (_, tokenIds) => ({
  // eslint-disable-next-line camelcase
  token_ids: tokenIds
});

export const getOwnerAsParams = (address) => ({
  owner: address
});

export const mapAssetsToOwnerData = (assets) => ({
  countAssets: assets.length,
  name: assets[0]?.owner?.user?.username || 'holder'
});
