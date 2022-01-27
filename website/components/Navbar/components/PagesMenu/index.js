import React from 'react';

import DropdownMenu from '../DropdownMenu';
import { MENU_OPTIONS_LIST } from '../../constants';

import styles from './styles.module.scss';

function PagesMenu({ isOpen, reference }) {
  return (
    <DropdownMenu isOpen={isOpen} options={MENU_OPTIONS_LIST} reference={reference} className={styles.menu} />
  );
}

export default PagesMenu;
