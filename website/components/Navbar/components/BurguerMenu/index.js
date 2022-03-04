import React from 'react';

import { getBurguerMenuItems } from '../../utils';

import { CLOSE_ICON } from './constants';
import styles from './styles.module.scss';

function BurgerMenu({ isOpen }) {
  const navbarItems = getBurguerMenuItems();
  return isOpen ? (
    <div className={styles['fixed-container']}>
      <div className={styles['close-container']}>
        <img src={CLOSE_ICON} className={styles['close-icon']} />
      </div>
      <div className={styles.content}>
        <div className={styles.items}>
          {navbarItems.map(({ label, ...props }) => (
            <NavbarButton key={label} text={label} isOwner={isConnected} {...props} />
          ))}
        </div>
      </div>
    </div>
  ) : null;
}

export default BurgerMenu;
