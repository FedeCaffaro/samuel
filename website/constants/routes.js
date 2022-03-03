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
  DASHBOARD: {
    label: i18next.t('Navbar:dashboard'),
    pagePath: '/dashboard',
    isWalletNeeded: true
  },
  COLLECTION: {
    label: i18next.t('Navbar:collections'),
    pagePath: '/collections/:collection'
  }
};

export const ROUTES_LIST = Object.values(ROUTES);
