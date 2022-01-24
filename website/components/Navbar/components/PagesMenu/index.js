import React from 'react';

import DropdownMenu from '../DropdownMenu';

import { OPTIONS } from './constants';
import styles from './styles.module.scss';

function PagesMenu({ isOpen, reference }) {
  return <DropdownMenu isOpen={isOpen} options={OPTIONS} reference={reference} className={styles.menu} />;
}

export default PagesMenu;
