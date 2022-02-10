import React from 'react';
import { useSelector } from 'react-redux';

import DropdownMenu from '../DropdownMenu';
import { MENU_OPTIONS_LIST } from '../../constants';

import styles from './styles.module.scss';

function PagesMenu({ isOpen, reference }) {
  const wallet = useSelector((state) => state.settings.wallet);

  const OPTIONS = MENU_OPTIONS_LIST.filter(
    ({ showInNavbar, isWalletNeeded }) => showInNavbar && (!isWalletNeeded || wallet?.account)
  );

  return <DropdownMenu isOpen={isOpen} options={OPTIONS} reference={reference} className={styles.menu} />;
}

export default PagesMenu;
