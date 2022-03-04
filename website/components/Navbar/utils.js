import i18next from 'i18next';
import { ROUTES } from '../../constants/routes';

import { DROPDOWN_ICON, LINK_ICON } from './constants';

export const getNavbarItems = (onClickLenguage, onClickCommunity) => [
  {
    label: i18next.t('Navbar:whitepaper'),
    link: '/whitepaper'
  },
  {
    label: i18next.t('Navbar:roadmap'),
    link: '/roadmap'
  },
  {
    label: i18next.t('Navbar:community'),
    onClick: onClickCommunity,
    icon: DROPDOWN_ICON
  },
  {
    label: i18next.t('Navbar:actualLanguage'),
    onClick: onClickLenguage,
    icon: DROPDOWN_ICON
  }
];

export const getBurguerMenuItems = (onConnectWallet, isConnected) => [
  {
    label: i18next.t('Navbar:whitepaper'),
    link: '/whitepaper'
  },
  {
    label: i18next.t('Navbar:roadmap'),
    link: '/roadmap'
  },
  {
    label: i18next.t(`Navbar:${isConnected ? 'ownersDashboard' : 'connectWallet'}`),
    onClick: isConnected ? null : onConnectWallet,
    link: isConnected ? ROUTES.DASHBOARD.pagePath : null,
    icon: LINK_ICON
  }
];
