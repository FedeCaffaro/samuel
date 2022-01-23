import React from 'react';

import { handleChangeLanguage } from '../../../../utils/language';

import { LANGUAGES } from './constants';
import styles from './styles.module.scss';

function LanguageMenu({ isOpen }) {
  return isOpen ? (
    <div className={styles['menu-container']}>
      {LANGUAGES.map(({ label, value }) => (
        <button
          type="button"
          className={styles['button-container']}
          key={label}
          onClick={handleChangeLanguage(value)}
        >
          {label}
        </button>
      ))}
    </div>
  ) : null;
}

export default LanguageMenu;
