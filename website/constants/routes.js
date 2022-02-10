import i18next from 'i18next';

export const ROUTES = {
  HOME: {
    label: i18next.t('Navbar:home'),
    pagePath: '/',
    showInNavbar: true
  },
  COLLECTIONS: {
    label: i18next.t('Navbar:collections'),
    pagePath: '/collections',
    showInNavbar: true
  },
  MY_NFT: {
    label: i18next.t('Navbar:myNfts'),
    pagePath: '/my_nfts',
    isWalletNeeded: true,
    showInNavbar: true
  },
  COLLECTION: {
    label: i18next.t('Navbar:collections'),
    pagePath: '/collections/:collection'
  }
};

export const ROUTES_LIST = Object.values(ROUTES);
