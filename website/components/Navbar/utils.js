import i18next from 'i18next';

import { MINT_FORM_WEB } from '../../constants/links';
import { ROUTES } from '../../constants/routes';

import { DROPDOWN_ICON, LINK_ICON } from './constants';

export const getNavbarItems = (onClickLenguage, onClickCommunity, filter = () => true) =>
  [
    {
      key: 'mint',
      label: i18next.t('Navbar:mint'),
      link: MINT_FORM_WEB,
      newTab: true
    },
    {
      key: 'shop',
      label: i18next.t('Navbar:shop'),
      link: 'https://samot.shop',
      newTab: true
    },
    {
      key: 'whitepaper',
      label: i18next.t('Navbar:whitepaper'),
      link: '/whitepaper'
    },
    {
      key: 'roadmap',
      label: i18next.t('Navbar:roadmap'),
      link: '/roadmap'
    },
    {
      key: 'community',
      label: i18next.t('Navbar:community'),
      onClick: onClickCommunity,
      icon: DROPDOWN_ICON
    },
    {
      key: 'languages',
      label: i18next.t('Navbar:actualLanguage'),
      onClick: onClickLenguage,
      icon: DROPDOWN_ICON
    }
  ].filter(filter);

export const getBurguerMenuItems = (onConnectWallet, isConnected) => [
  {
    label: i18next.t('Navbar:shop'),
    link: 'https://samot.shop',
    newTab: true
  },
  {
    label: i18next.t('Navbar:whitepaper'),
    link: '/whitepaper'
  },
  {
    label: i18next.t('Navbar:roadmap'),
    link: '/roadmap'
  },
  {
    label: i18next.t(isConnected ? 'Navbar:ownersDashboard' : 'Navbar:connectWallet'),
    onClick: isConnected ? null : onConnectWallet,
    link: isConnected ? ROUTES.DASHBOARD.pagePath : null,
    icon: LINK_ICON
  }
];

export const getLanguageOptions = () => [
  {
    label: 'es',
    value: 'es'
  },
  {
    label: 'en',
    value: 'en'
  },
  {
    label: 'pr',
    value: 'pr'
  }
];
