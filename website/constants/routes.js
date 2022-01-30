import i18next from 'i18next';

export const ROUTES = {
  HOME: {
    label: i18next.t('Navbar:home'),
    pagePath: '/'
  },
  COLLECTIONS: {
    label: i18next.t('Navbar:collections'),
    pagePath: '/collections'
  },
  MY_NFT: {
    label: i18next.t('Navbar:myNfts'),
    pagePath: '/my_nfts',
    isWalletNeeded: true
  }
};

export const ROUTES_LIST = Object.values(ROUTES);
