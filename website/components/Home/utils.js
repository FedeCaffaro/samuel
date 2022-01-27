// TODO: use a env variable
// export const OS_API_ENDPOINT = window?.location?.hostname?.includes('localhost')
//   ? 'https://rinkeby-api.opensea.io/api/v1'
//   : 'https://api.opensea.io/api/v1';

export const OS_API_ENDPOINT = 'https://api.opensea.io/api/v1';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
