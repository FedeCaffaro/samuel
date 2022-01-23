/* eslint-disable no-empty-function */
import React from 'react';

import styles from './styles.module.scss';

function NavbarButton({ text, icon, onClick = () => {} }) {
  return (
    <div className={styles['menu-container']} onClick={onClick}>
      <span className={styles['menu-text']}>{text}</span>
      <img src={icon} className={styles['menu-icon']} />
    </div>
  );
}

export default NavbarButton;
