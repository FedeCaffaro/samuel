import i18next from 'i18next';

export const LOGO = '/assets/general/logo-samot.png';
export const DROPDOWN_ICON = '/assets/general/dropdown-icon.svg';
export const MENU_ICON = '/assets/general/menu-icon.svg';

export const MENU_OPTIONS = {
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
    pagePath: '/my_nfts'
  }
};

export const MENU_OPTIONS_LIST = Object.values(MENU_OPTIONS);
