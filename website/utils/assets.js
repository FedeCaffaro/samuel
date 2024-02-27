const mapAssetFromService = ({ name, image_url, owner, lastSale, identifier }) => ({
  name,
  image_url,
  owner,
  lastSale,
  identifier
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
  assets: mapAssetsFromService(assets),
  name: assets[0]?.owner?.user?.username || 'holder'
});
