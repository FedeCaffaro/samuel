import React from 'react';

import { handleChangeLanguage } from '../../../../utils/language';
import DropdownMenu from '../DropdownMenu';

import { LANGUAGES } from './constants';
import styles from './styles.module.scss';

function LanguageMenu({ isOpen, reference, isOwner, showingLogo }) {
  const options = LANGUAGES.map(({ label, value }) => ({
    label,
    onClick: handleChangeLanguage(value)
  }));

  return (
    <DropdownMenu
      isOpen={isOpen}
      options={options}
      reference={reference}
      isOwner={isOwner}
      className={showingLogo ? styles['menu-left'] : styles.menu}
    />
  );
}

export default LanguageMenu;
